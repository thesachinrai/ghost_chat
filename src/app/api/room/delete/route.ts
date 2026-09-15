import { redis } from "@/lib/redis"
import { realtime } from "@/lib/realtime"
import { authorize, AuthError } from "@/lib/auth-utils"
import { NextResponse } from "next/server"

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 })
    }

    const { connected } = await authorize(roomId)

    // Notify all users in the room
    await realtime.channel(roomId).emit("chat.destroy", { isDestroyed: true })

    // Delete all room keys
    await Promise.all([
        redis.del(roomId), // Not sure if this key was used, but original code had it
        redis.del(`meta:${roomId}`),
        redis.del(`messages:${roomId}`),
    ])
    
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
