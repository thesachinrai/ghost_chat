"use client"

import { useState } from "react"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  roomId: string
  passcode: string
}

export function ShareModal({ isOpen, onClose, roomId, passcode }: ShareModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  if (!isOpen) return null

  const roomUrl = typeof window !== "undefined" ? `${window.location.origin}/room/${roomId}` : ""

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Share Room</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Room URL - Copy URL button */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]">Room URL</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] font-mono truncate">
                {roomUrl}
              </div>
              <button
                onClick={() => copyToClipboard(roomUrl, "url")}
                className="bg-green-600 hover:bg-green-500 px-4 py-3 text-xs font-bold text-white transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedField === "url" ? "COPIED!" : "COPY URL"}
              </button>
            </div>
          </div>

          {/* Room ID - Copy ID button */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]">Room ID</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] font-mono truncate">
                {roomId}
              </div>
              <button
                onClick={() => copyToClipboard(roomId, "id")}
                className="bg-[var(--card-border)] hover:bg-[var(--muted-foreground)] px-4 py-3 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedField === "id" ? "COPIED!" : "COPY"}
              </button>
            </div>
          </div>

          {/* Passcode */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]">Passcode</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] font-mono tracking-widest">
                {passcode}
              </div>
              <button
                onClick={() => copyToClipboard(passcode, "passcode")}
                className="bg-[var(--card-border)] hover:bg-[var(--muted-foreground)] px-4 py-3 text-xs font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedField === "passcode" ? "COPIED!" : "COPY"}
              </button>
            </div>
          </div>

          <p className="text-[var(--muted-foreground)] text-xs text-center mt-4">
            Share the URL and passcode with the person you want to chat with.
          </p>
        </div>
      </div>
    </div>
  )
}
