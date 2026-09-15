"use client"
import { useState, useEffect } from "react"

export function AnonymousCard() {
  const usernames = [
    "anonymous-wolf-x7k2m",
    "anonymous-hawk-p3n9q",
    "anonymous-bear-j5t8w",
    "anonymous-shark-r2v6y",
  ]
  const [currentUsernameIndex, setCurrentUsernameIndex] = useState(0)
  const [typedName, setTypedName] = useState("")
  const [isTypingName, setIsTypingName] = useState(true)

  useEffect(() => {
    let charIndex = 0
    let usernameIndex = 0
    let isDeleting = false
    let cancelled = false
    
    const typeChar = () => {
      if (cancelled) return
      const current = usernames[usernameIndex]
      if (!isDeleting) {
        if (charIndex <= current.length) {
          setTypedName(current.slice(0, charIndex))
          setIsTypingName(charIndex < current.length)
          charIndex++
          setTimeout(typeChar, 80 + Math.random() * 40)
        } else {
          setIsTypingName(false)
          setTimeout(() => {
            isDeleting = true
            typeChar()
          }, 2000)
        }
      } else {
        if (charIndex > 0) {
          charIndex--
          setTypedName(current.slice(0, charIndex))
          setIsTypingName(true)
          setTimeout(typeChar, 40)
        } else {
          isDeleting = false
          usernameIndex = (usernameIndex + 1) % usernames.length
          setCurrentUsernameIndex(usernameIndex)
          setTimeout(typeChar, 300)
        }
      }
    }
    const timeout = setTimeout(typeChar, 500)
    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="premium-card p-6 md:p-10 relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Completely Anonymous</h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">No accounts, no sign-ups, no tracking. Your identity is randomly generated for each session.</p>
        
        <div className="bg-white/40 border border-[var(--dust-grey)] rounded-xl p-4 mt-4 shadow-inner">
          <div className="mb-4">
            <div className="text-[var(--muted)] text-xs mb-2 uppercase tracking-widest font-semibold">Generated Identity</div>
            <div className="bg-[var(--ivory-mist)]/50 rounded-lg px-4 py-3 border border-[var(--dust-grey)]">
              <div className="flex items-center h-6">
                <span className="text-[var(--foreground)] font-mono text-sm">{typedName}</span>
                {isTypingName && (
                  <span className="w-1.5 h-4 bg-[var(--grey-olive)] ml-1 animate-pulse" />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {["No Sign-up", "No Tracking", "No Cookies"].map((tag) => (
              <div key={tag} className="flex items-center gap-2 px-3 py-1.5 bg-[var(--dust-grey)]/30 border border-[var(--dust-grey)] text-[var(--foreground)] text-xs font-medium rounded-md">
                <span className="w-1.5 h-1.5 bg-[var(--ash-grey)] rounded-full" />
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}