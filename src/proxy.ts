import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Redis } from "@upstash/redis"

const redis = Redis.fromEnv()

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const pathname = request.nextUrl.pathname

  // --- 1. Security Headers (Global) ---
  const headers = response.headers
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://assets.vercel.com;
    font-src 'self' data:;
    connect-src 'self' https://phantom-chat-app.vercel.app *.upstash.io ws: wss:;
    frame-src 'self';
    base-uri 'self';
  `.replace(/\s{2,}/g, " ").trim()

  headers.set("Content-Security-Policy", csp)
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
  headers.set("X-Frame-Options", "DENY")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()")

  // --- 2. Room Protection Logic ---
  if (pathname.startsWith("/room")) {
    if (pathname.match(/^\/room\/[^/]+\/verify$/) || pathname === "/room") {
      return response
    }

    const roomMatch = pathname.match(/^\/room\/([^/]+)$/)
    if (roomMatch) {
      const roomId = roomMatch[1]

      try {
        const meta = await redis.hgetall<{ connected: string[]; createdAt: number; passcode: string }>(
          `meta:${roomId}`
        )

        if (!meta) {
           return NextResponse.redirect(new URL("/room?error=room-not-found", request.url))
        }

        const existingToken = request.cookies.get("x-auth-token")?.value

        if (!existingToken || !meta.connected?.includes(existingToken)) {
          return NextResponse.redirect(new URL(`/room/${roomId}/verify`, request.url))
        }
      } catch (error) {
        console.error("Proxy Redis Error:", error)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
}
