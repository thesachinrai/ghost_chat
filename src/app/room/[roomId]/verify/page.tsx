"use client"
import { useState, useRef, KeyboardEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { client } from "@/lib/client"
import { useUsername } from "@/hooks/use-username"

export default function VerifyPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string
  const { username } = useUsername()

  const [passcodeDigits, setPasscodeDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const passcode = passcodeDigits.join('')
  const isPasscodeComplete = passcode.length === 6

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    
    const newDigits = [...passcodeDigits]
    newDigits[index] = digit
    setPasscodeDigits(newDigits)
    
    setError(null)

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !passcodeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'Enter' && isPasscodeComplete) {
      handleVerify()
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
    
    const nextEmptyIndex = newDigits.findIndex(d => !d)
    inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus()
  }

  const handleVerify = async () => {
    if (!passcode.trim() || passcode.length !== 6) {
      setError("Please enter a 6-digit passcode")
      return
    }

    setIsLoading(true)
    setError(null)

    const res = await client.room.verify(roomId, passcode.trim(), username)

    if (res.status === 200) {
      sessionStorage.setItem(`passcode:${roomId}`, passcode.trim())
      router.push(`/room/${roomId}`)
    } else if (res.status === 404) {
      router.push("/room?error=room-not-found")
    } else if (res.status === 403) {
      router.push("/room?error=room-full")
    } else {
      setError(res.error || "Invalid passcode")
    }

    setIsLoading(false)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--background)] overflow-hidden relative">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--ash-grey)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--dust-grey)]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
            {">"}enter_passcode
          </h1>
          <p className="text-[var(--muted)] text-sm">
            This room is protected. Enter the passcode to join.
          </p>
        </div>

        <div className="border border-[var(--card-border)] bg-[var(--card-bg)] p-6 backdrop-blur-md">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-[var(--muted)]">Room ID</label>
              <div className="bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--muted)] font-mono truncate">
                {roomId}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center text-[var(--muted)]">Passcode</label>
                {error ? (
                  <span className="text-red-400 text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                    {error}
                  </span>
                ) : isPasscodeComplete && (
                  <span className="text-[var(--grey-olive)] text-xs flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[var(--grey-olive)] rounded-full" />
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
                    autoFocus={i === 0}
                    className={`w-10 h-12 bg-[var(--muted)]/10 border rounded-lg flex items-center justify-center text-center text-lg font-mono font-bold transition-all duration-200 focus:outline-none ${
                      error
                        ? 'border-red-500 bg-red-500/10 text-red-400'
                        : isPasscodeComplete
                          ? 'border-[var(--grey-olive)] bg-[var(--grey-olive)]/10 text-[var(--grey-olive)]'
                          : digit
                            ? 'border-[var(--ash-grey)] bg-[var(--ash-grey)]/5 text-[var(--foreground)]'
                            : 'border-[var(--muted)] text-[var(--foreground)]'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={isLoading}
              className="w-full bg-[var(--grey-olive)] hover:bg-[var(--ash-grey)] text-[var(--background)] p-3 text-sm font-bold transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? "VERIFYING..." : "JOIN ROOM"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}