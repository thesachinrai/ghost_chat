import { redis } from "@/lib/redis"
import { authorize, AuthError } from "@/lib/auth-utils"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 })
    }

    await authorize(roomId)

    const ttl = await redis.ttl(`meta:${roomId}`)
    return NextResponse.json({ ttl: ttl > 0 ? ttl : 0 })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
