import { redis } from "@/lib/redis"
import { ratelimit } from "@/lib/ratelimit"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { nanoid } from "nanoid"
import { z } from "zod"

const verifySchema = z.object({
  passcode: z.string().length(6, "Passcode must be 6 digits"),
  username: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 })
    }

    // 1. Rate Limiting (Brute Force Protection)
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"
    const { success } = await ratelimit.limit(`verify_room_${ip}`)
    
    if (!success) {
       return NextResponse.json(
         { error: "Too many attempts. Please try again later." },
         { status: 429 }
       )
    }

    const body = await request.json()
    const result = verifySchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 })
    }
    
    const { passcode } = result.data

    // Check if room exists
    const meta = await redis.hgetall(`meta:${roomId}`) as { passcode: string; connected: string[] } | null

    if (!meta) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    if (String(meta.passcode) !== passcode) {
      return NextResponse.json({ error: "Invalid passcode" }, { status: 401 })
    }

    // Check capacity (max 50)
    const connected = meta.connected || []
    if (connected.length >= 50) {
      return NextResponse.json({ error: "Room full" }, { status: 403 })
    }

    // Generate token
    const token = nanoid()

    // Add to connected list
    // Redis JSON arrays are tricky with hset/hget if stored as strings or JSON. 
    // Upstash/redis usually handles objects if we passed an object to hset.
    // But `connected` comes back as a string array or we need to manage it.
    // In the elysia code: `await redis.hset(\`meta:${roomId}\`, { connected: [], ... })`
    // It seems it was storing it as a JSON object field? 
    // Let's assume we update it.
    
    // We need to re-fetch to ensure we have the array, append, and save.
    // Or use hget specifically.
    // Ideally we should use a set for tokens but let's stick to the list pattern.
    
    const newConnected = [...(Array.isArray(connected) ? connected : []), token]
    
    await redis.hset(`meta:${roomId}`, {
      connected: newConnected
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("x-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verify room error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
