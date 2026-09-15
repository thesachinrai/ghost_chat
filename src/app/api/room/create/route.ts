import { redis } from "@/lib/redis"
import { ratelimit } from "@/lib/ratelimit"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const ROOM_TTL_SECONDS = 60 * 10 // 10 minutes

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting (DoS Protection)
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
    const { success } = await ratelimit.limit(`create_room_${ip}`)
    
    if (!success) {
       return NextResponse.json(
         { error: "Too many requests. Please try again later." },
         { status: 429 }
       )
    }

    const roomId = nanoid()
    
    // 2. Secure RNG for Passcode
    // Using crypto.getRandomValues for cryptographically strong randomness
    const array = new Uint32Array(1)
    crypto.getRandomValues(array)
    // Generate 6-digit code: ensure range 100000-999999
    const passcode = (100000 + (array[0] % 900000)).toString()
    
    // Generate token for the creator
    const token = nanoid()

    await redis.hset(`meta:${roomId}`, {
      connected: [token], // Add creator's token immediately
      createdAt: Date.now(),
      passcode,
    })

    await redis.expire(`meta:${roomId}`, ROOM_TTL_SECONDS)

    // Set cookie for the creator
    const cookieStore = await cookies()
    cookieStore.set("x-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    })

    return NextResponse.json({ roomId, passcode })
  } catch (error) {
    console.error("Create room error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
