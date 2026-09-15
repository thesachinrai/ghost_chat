import { Message } from "./realtime"

const BASE_URL = typeof window !== "undefined" ? "" : "http://localhost:3000"

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

async function fetchApi<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      return { error: data.error || "Request failed", status: res.status }
    }
    
    return { data, status: res.status }
  } catch (error) {
    return { error: "Network error", status: 500 }
  }
}

export const client = {
  room: {
    create: async () => {
      return fetchApi<{ roomId: string; passcode: string }>("/api/room/create", { method: "POST" })
    },
    ttl: async (roomId: string) => {
      return fetchApi<{ ttl: number }>(`/api/room/ttl?roomId=${roomId}`)
    },
    delete: async (roomId: string) => {
      return fetchApi<{ success: boolean }>(`/api/room/delete?roomId=${roomId}`, { method: "DELETE" })
    },
    verify: async (roomId: string, passcode: string, username?: string) => {
      return fetchApi<{ success: boolean }>(`/api/room/verify?roomId=${roomId}`, {
        method: "POST",
        body: JSON.stringify({ passcode, username }),
      })
    },
    info: async (roomId: string) => {
      return fetchApi<{ passcode: string; roomId: string }>(`/api/room/info?roomId=${roomId}`)
    },
  },
  messages: {
    get: async (roomId: string) => {
      return fetchApi<{ messages: Message[] }>(`/api/messages?roomId=${roomId}`)
    },
    send: async (roomId: string, data: { sender: string; text: string }) => {
      return fetchApi<{ success: boolean }>(`/api/messages?roomId=${roomId}`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  },
  typing: {
    send: async (roomId: string, data: { sender: string; isTyping: boolean }) => {
      return fetchApi<{ success: boolean }>(`/api/typing?roomId=${roomId}`, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
  },
}
