import { redis } from "@/lib/redis"
import { cookies } from "next/headers"

export interface AuthResult {
  roomId: string
  token: string
  connected: string[]
}

export interface AuthError {
  error: string
  status: 401
}

export async function validateAuth(roomId: string | null): Promise<AuthResult | AuthError> {
  const cookieStore = await cookies()
  const token = cookieStore.get("x-auth-token")?.value

  if (!roomId || !token) {
    return { error: "Missing roomId or token.", status: 401 }
  }

  const connected = await redis.hget<string[]>(`meta:${roomId}`, "connected")

  if (!connected?.includes(token)) {
    return { error: "Invalid token", status: 401 }
  }

  return { roomId, token, connected }
}

export function isAuthError(result: AuthResult | AuthError): result is AuthError {
  return "error" in result
}
