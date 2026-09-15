import { realtime } from "@/lib/realtime"
import { authorize, AuthError } from "@/lib/auth-utils"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get("roomId")

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 })
    }

    await authorize(roomId)
    const body = await request.json()
    const { sender, isTyping } = body

    if (!sender) {
        return NextResponse.json({ error: "Missing sender" }, { status: 400 })
    }

    await realtime.channel(roomId).emit("chat.typing", { sender, isTyping })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
