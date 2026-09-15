import { redis } from "@/lib/redis"
import { cookies } from "next/headers"

export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }
}

export async function authorize(roomId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("x-auth-token")?.value

  if (!roomId || !token) {
    throw new AuthError("Missing roomId or token.")
  }

  const connected = await redis.hget<string[]>(`meta:${roomId}`, "connected")

  if (!connected?.includes(token)) {
    throw new AuthError("Invalid token")
  }

  return { roomId, token, connected }
}
