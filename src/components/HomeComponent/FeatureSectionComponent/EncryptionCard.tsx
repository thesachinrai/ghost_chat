"use client"
import { useState, useEffect } from "react"
import { Lock } from "lucide-react"

export function EncryptionCard() {
  const messages = [
    "Hey, meet me at 5pm?",
    "The password is 847291",
    "Don't tell anyone!",
    "This stays between us",
    "Delete after reading",
  ]
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDecrypting, setIsDecrypting] = useState(true)
  const chars = "!@#$%^&*()_+-=[]{}|;:',.<>?/~`"

  useEffect(() => {
    const currentMessage = messages[currentMsgIndex]
    let revealedCount = 0
    let isRevealing = true
    let cancelled = false
    
    const generateScrambled = (revealed: number) => {
      return currentMessage.split('').map((char, i) => {
        if (char === ' ') return ' '
        if (i < revealed) return char
        return chars[Math.floor(Math.random() * chars.length)]
      }).join('')
    }
    
    setDisplayText(generateScrambled(0))
    setIsDecrypting(true)
    
    const interval = setInterval(() => {
      if (cancelled) return
      if (isRevealing) {
        revealedCount++
        setDisplayText(generateScrambled(revealedCount))
        if (revealedCount >= currentMessage.length) {
          isRevealing = false
          setIsDecrypting(false)
          setDisplayText(currentMessage)
          setTimeout(() => {
            if (!cancelled) {
              const hideInterval = setInterval(() => {
                if (cancelled) {
                  clearInterval(hideInterval)
                  return
                }
                revealedCount--
                if (revealedCount <= 0) {
                  clearInterval(hideInterval)
                  setCurrentMsgIndex((prev) => (prev + 1) % messages.length)
                } else {
                  setDisplayText(generateScrambled(revealedCount))
                  setIsDecrypting(true)
                }
              }, 40)
            }
          }, 2000)
        }
      }
    }, 60)
    
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [currentMsgIndex])

  return (
    <div className="premium-card p-6 md:p-10 relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">End-to-End Encryption</h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">Your messages are encrypted before leaving your device. Not even we can read them.</p>
        
        <div className="bg-white/40 border border-[var(--dust-grey)] rounded-xl p-4 mt-4 shadow-inner">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--ivory-mist)] border border-[var(--dust-grey-2)] rounded-lg flex items-center justify-center">
              <Lock className={`w-5 h-5 transition-colors duration-300 ${isDecrypting ? 'text-[var(--ash-grey)]' : 'text-[var(--grey-olive)]'}`} />
            </div>
            <div>
              <div className="text-[var(--foreground)] text-sm font-semibold">AES-256 Encryption</div>
              <div className="text-[var(--muted-foreground)] text-xs flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isDecrypting ? 'bg-[var(--ash-grey)] animate-pulse' : 'bg-[var(--grey-olive)]'}`} />
                {isDecrypting ? 'Decrypting payload...' : 'Decrypted successfully'}
              </div>
            </div>
          </div>
          
          <div className="bg-[var(--ivory-mist)]/50 border border-[var(--dust-grey)] rounded-lg px-4 py-3 font-mono text-sm">
            <div className="text-[var(--muted)] text-xs mb-2 uppercase tracking-widest font-semibold">Message Output</div>
            <div className={`transition-colors duration-300 ${isDecrypting ? 'text-[var(--ash-grey)]' : 'text-[var(--foreground)]'}`}>
              {displayText}
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <span className="px-2 py-1 bg-[var(--dust-grey)]/30 border border-[var(--dust-grey)] text-[var(--foreground)] text-xs flex items-center gap-1.5 rounded-md font-medium">
              <span className="w-1.5 h-1.5 bg-[var(--grey-olive)] rounded-full" /> Encrypted
            </span>
            <span className="px-2 py-1 bg-[var(--dust-grey)]/30 border border-[var(--dust-grey)] text-[var(--foreground)] text-xs flex items-center gap-1.5 rounded-md font-medium">
              <span className="w-1.5 h-1.5 bg-[var(--ash-grey)] rounded-full" /> Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}