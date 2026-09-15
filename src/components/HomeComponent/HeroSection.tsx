"use client"
import { forwardRef } from "react"
import { useRouter } from "next/navigation"

interface HeroSectionProps {
  ghostRef: React.RefObject<HTMLSpanElement | null>
  titleRef: React.RefObject<HTMLHeadingElement | null>
  subtitleRef: React.RefObject<HTMLParagraphElement | null>
  ctaRef: React.RefObject<HTMLDivElement | null>
}

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  function HeroSection({ ghostRef, titleRef, subtitleRef, ctaRef }, ref) {
    const router = useRouter()

    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20"
      >
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-6 flex flex-col items-center">
          
          

          <h1
            ref={titleRef}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-[var(--foreground)] opacity-0 pb-2"
          >
            Leave no trace.
          </h1>
          
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-xl mx-auto font-light tracking-wide opacity-0"
          >
            Ephemeral, end-to-end encrypted rooms. No sign-ups, no server logs, absolutely zero history.
          </p>

          <div ref={ctaRef} className="pt-10 opacity-0">
            <button
              onClick={() => router.push("/room")}
              className="group relative px-8 py-3.5 bg-[var(--foreground)] text-[var(--ivory-mist)] rounded-full font-medium text-sm transition-all hover:bg-[var(--grey-olive)] cursor-pointer shadow-[0_8px_20px_-5px_rgba(154,153,140,0.4)]"
            >
              Initialize Session
            </button>
          </div>
        </div>
      </section>
    )
  }
)