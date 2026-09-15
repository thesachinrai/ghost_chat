"use client"

import { useState, useRef, KeyboardEvent } from "react"
import { client } from "@/lib/client"
import { useRouter } from "next/navigation"
import { useUsername } from "@/hooks/use-username"

interface JoinRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const router = useRouter()
  const { username } = useUsername()
  const [roomId, setRoomId] = useState("")
  const [passcodeDigits, setPasscodeDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  if (!isOpen) return null

  const passcode = passcodeDigits.join('')

  const handleDigitChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, "").slice(-1)
    
    const newDigits = [...passcodeDigits]
    newDigits[index] = digit
    setPasscodeDigits(newDigits)
    setError(null)

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !passcodeDigits[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, "").slice(0, 6)
    const newDigits = [...passcodeDigits]
    for (let i = 0; i < pastedData.length; i++) {
      newDigits[i] = pastedData[i]
    }
    setPasscodeDigits(newDigits)
    // Focus the next empty input or last input
    const nextEmptyIndex = newDigits.findIndex(d => !d)
    inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus()
  }

  const handleJoin = async () => {
    if (!roomId.trim() || !passcode.trim()) {
      setError("Please enter both Room ID and Passcode")
      return
    }

    if (passcode.length !== 6) {
      setError("Passcode must be 6 digits")
      return
    }

    setIsLoading(true)
    setError(null)

    const res = await client.room.verify(roomId.trim(), passcode.trim(), username)

    if (res.status === 200) {
      router.push(`/room/${roomId.trim()}`)
      onClose()
    } else {
      setError(res.error || "Failed to join room")
    }

    setIsLoading(false)
  }

  const isPasscodeComplete = passcode.length === 6

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)]">Join a Room</h2>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:border-[var(--muted)]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[var(--muted)]">Passcode</label>
              {error ? (
                <span className="text-red-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                  {error}
                </span>
              ) : isPasscodeComplete && (
                <span className="text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-600 dark:bg-green-400 rounded-full" />
                  Ready
                </span>
              )}
            </div>
            <div className={`flex items-center justify-center gap-2 ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
              {passcodeDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { inputRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className={`w-10 h-12 bg-[var(--muted)]/10 border rounded-lg flex items-center justify-center text-center text-lg font-mono font-bold transition-all duration-200 focus:outline-none ${
                    error
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : isPasscodeComplete
                        ? 'border-green-500 bg-green-500/10 text-green-400'
                        : digit
                          ? 'border-blue-500 bg-blue-500/5 text-[var(--foreground)]'
                          : 'border-[var(--muted)] text-[var(--foreground)]'
                  }`}
                />
              ))}
            </div>
          </div>



          <button
            onClick={handleJoin}
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-500 text-white p-3 text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "JOINING..." : "JOIN ROOM"}
          </button>
        </div>
      </div>
    </div>
  )
}
