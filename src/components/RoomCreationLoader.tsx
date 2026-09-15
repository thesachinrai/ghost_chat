"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

export function RoomCreationLoader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating ghost animation
      gsap.to(ghostRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })

      // Pulse effect directly on the ghost element
      gsap.to(ghostRef.current, {
        opacity: 0.7,
        scale: 0.95,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Text fade in/out slightly
      gsap.to(textRef.current, {
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <div ref={ghostRef} className="text-8xl md:text-9xl mb-8 relative">
        <span className="relative z-10">👻</span>
        {/* Glow effect behind ghost */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl -z-10" />
      </div>
      
      <p
        ref={textRef}
        className="text-xl md:text-2xl font-bold text-[var(--ivory-mist)] tracking-widest uppercase"
      >
        Creating Secure Room...
      </p>
    </div>
  )
}
