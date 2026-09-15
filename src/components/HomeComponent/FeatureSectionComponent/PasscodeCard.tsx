"use client"
import { useState, useEffect } from "react"

export function PasscodeCard() {
  const [passcodeDigits, setPasscodeDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [passcodeComplete, setPasscodeComplete] = useState(false)
  const [passcodeWrong, setPasscodeWrong] = useState(false)
  const [passcodeIndex, setPasscodeIndex] = useState(0)
  const [passcodeAttempt, setPasscodeAttempt] = useState(0)
  const [passcodePhase, setPasscodePhase] = useState<'typing' | 'complete' | 'wrong' | 'waiting'>('waiting')

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (passcodePhase === 'waiting') {
      timeout = setTimeout(() => {
        setPasscodePhase('typing')
        setPasscodeIndex(0)
        setPasscodeDigits(['', '', '', '', '', ''])
        setPasscodeComplete(false)
        setPasscodeWrong(false)
      }, 500)
    } else if (passcodePhase === 'typing') {
      if (passcodeIndex < 6) {
        timeout = setTimeout(() => {
          const digit = Math.floor(Math.random() * 10).toString()
          setPasscodeDigits(prev => {
            const newDigits = [...prev]
            newDigits[passcodeIndex] = digit
            return newDigits
          })
          setPasscodeIndex(prev => prev + 1)
        }, 250 + Math.random() * 150)
      } else {
        if (passcodeAttempt % 2 === 0) {
          setPasscodeComplete(true)
          setPasscodePhase('complete')
        } else {
          setPasscodeWrong(true)
          setPasscodePhase('wrong')
        }
        setPasscodeAttempt(prev => prev + 1)
      }
    } else if (passcodePhase === 'complete') {
      timeout = setTimeout(() => {
        setPasscodePhase('waiting')
      }, 2500)
    } else if (passcodePhase === 'wrong') {
      timeout = setTimeout(() => {
        setPasscodePhase('waiting')
      }, 1500)
    }
    return () => clearTimeout(timeout)
  }, [passcodePhase, passcodeIndex, passcodeAttempt])

  return (
    <div className="premium-card p-6 md:p-10 relative overflow-hidden group">
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Passcode Protected</h3>
        <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">A 6-digit passcode ensures only invited users can join your private room.</p>
        
        <div className="bg-white/40 border border-[var(--dust-grey)] rounded-xl p-4 mt-4 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[var(--muted)] text-xs uppercase tracking-widest font-semibold">Enter Passcode</span>
            {passcodeComplete && (
              <span className="text-[var(--grey-olive)] text-xs flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 bg-[var(--grey-olive)] rounded-full" /> Access Granted
              </span>
            )}
            {passcodeWrong && (
              <span className="text-[#a27c73] text-xs flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 bg-[#a27c73] rounded-full animate-pulse" /> Access Denied
              </span>
            )}
          </div>
          
          <div className={`flex items-center justify-center gap-2 md:gap-3 ${passcodeWrong ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
            {passcodeDigits.map((digit, i) => (
              <div 
                key={i}
                className={`w-8 h-10 md:w-10 md:h-12 bg-[var(--ivory-mist)]/50 border rounded-lg flex items-center justify-center transition-all duration-200 ${
                  passcodeComplete 
                    ? 'border-[var(--grey-olive)] bg-[var(--dust-grey)]/40' 
                    : passcodeWrong 
                      ? 'border-[#a27c73] bg-[#a27c73]/10' 
                      : digit 
                        ? 'border-[var(--ash-grey)] shadow-[0_0_10px_rgba(154,153,140,0.1)]' 
                        : 'border-[var(--dust-grey)]'
                }`}
              >
                {digit ? (
                  <span className={`text-lg font-mono font-semibold ${
                    passcodeComplete ? 'text-[var(--grey-olive)]' : passcodeWrong ? 'text-[#a27c73]' : 'text-[var(--foreground)]'
                  }`}>{digit}</span>
                ) : (
                  <span className="w-2 h-0.5 bg-[var(--dust-grey-2)] rounded" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}