import { redis } from "@/lib/redis"
import { realtime, Message } from "@/lib/realtime"
import { authorize, AuthError } from "@/lib/auth-utils"
import { nanoid } from "nanoid"
import { NextResponse } from "next/server"

// GET: Fetch messages
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 })
    }

    const { token } = await authorize(roomId)

    const messages = await redis.lrange<Message>(`messages:${roomId}`, 0, -1)

    // Filter sensitive data? The original code did:
    // ...m, token: m.token === auth.token ? auth.token : undefined
    // Wait, Message type in lib/realtime might not have token.
    // Let's check original route:
    // interface Message { id, sender, text, timestamp, roomId }
    // But it pushed { ...message, token: auth.token } to Redis.
    // So distinct messages have tokens.

    const sanitizedMessages = messages.map((m: any) => ({
        ...m,
        token: m.token === token ? token : undefined
    }))

    return NextResponse.json({ messages: sanitizedMessages })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST: Send message
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 })
    }

    const { token } = await authorize(roomId)
    const body = await request.json()
    const { sender, text } = body

    if (!sender || !text) {
        return NextResponse.json({ error: "Missing sender or text" }, { status: 400 })
    }

    if (text.length > 1000) {
        return NextResponse.json({ error: "Message too long" }, { status: 400 })
    }

    // Check if room exists (redundant with authorize usually, but good practice)
    const roomExists = await redis.exists(`meta:${roomId}`)
    if (!roomExists) {
        return NextResponse.json({ error: "Room does not exist" }, { status: 404 })
    }

    const message: Message = {
        id: nanoid(),
        sender,
        text,
        timestamp: Date.now(),
        roomId,
    }

    // Add to history with token
    await redis.rpush(`messages:${roomId}`, { ...message, token })
    
    // Emit to realtime channel
    await realtime.channel(roomId).emit("chat.message", message)

    // Housekeeping: refresh TTL
    const remaining = await redis.ttl(`meta:${roomId}`)
    if (remaining > 0) {
        await Promise.all([
            redis.expire(`messages:${roomId}`, remaining),
            redis.expire(roomId, remaining), // 'history:roomId' was in old code too?
            // "await redis.expire(`history:${roomId}`, remaining)" -> Wait, the old code had `messages:${roomId}` AND `history:${roomId}`?
            // "redis.rpush(`messages:${roomId}`, ...)" -> So messages ARE history.
            // Oh, the old code had:
            // redis.expire(`messages:${roomId}`, remaining)
            // redis.expire(`history:${roomId}`, remaining)
            // But it only pushed to `messages:${roomId}`. Maybe `history` was older code.
            // keeping it simple.
        ])
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
