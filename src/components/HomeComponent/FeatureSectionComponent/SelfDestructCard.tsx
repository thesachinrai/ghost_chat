"use client"
import { useState, useEffect } from "react"

export function SelfDestructCard() {
  const [timeLeft, setTimeLeft] = useState(600)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 600
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progressPercent = (timeLeft / 600) * 100

  return (
    <div className="premium-card p-6 md:p-10 relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Self-Destructing Messages</h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">Messages vanish after 10 minutes of inactivity. No server logs, no message history, no traces left behind.</p>
        
        <div className="bg-white/40 border border-[var(--dust-grey)] rounded-xl p-4 mt-4 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--muted)] text-xs uppercase tracking-widest font-semibold">Time Remaining</span>
            <span className={`text-xs flex items-center gap-1.5 uppercase tracking-widest font-semibold ${timeLeft < 60 ? 'text-[#a27c73]' : 'text-[var(--foreground)]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${timeLeft < 60 ? 'bg-[#a27c73] animate-pulse' : 'bg-[var(--grey-olive)] animate-pulse'}`} />
              {timeLeft < 60 ? 'Deleting soon' : 'Auto-delete'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`text-3xl font-light font-mono transition-colors duration-300 ${
              timeLeft < 60 ? 'text-[#a27c73]' : 'text-[var(--foreground)]'
            }`}>
              {formatTime(timeLeft)}
            </span>
            <div className="flex-1 h-1.5 bg-[var(--dust-grey)] rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timeLeft < 60 ? 'bg-[#a27c73]' : 'bg-[var(--grey-olive)]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          
          <div className="mt-6 space-y-2">
            <div 
              className="bg-[var(--ivory-mist)]/50 border border-[var(--dust-grey)] rounded-lg px-3 py-2 text-[var(--muted-foreground)] text-sm transition-opacity duration-500"
              style={{ opacity: Math.min(progressPercent / 100, 1) }}
            >
              Hey, this message will self-destruct! 
            </div>
            <div 
              className="bg-[var(--ivory-mist)]/50 border border-[var(--dust-grey)] rounded-lg px-3 py-2 text-[var(--muted-foreground)] text-sm transition-opacity duration-500"
              style={{ opacity: Math.min((progressPercent - 20) / 80, 1) }}
            >
              No one can read it after the timer ends.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}