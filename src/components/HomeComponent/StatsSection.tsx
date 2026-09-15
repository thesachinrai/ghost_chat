"use client"

import { useEffect, useState, useRef } from "react"
import { Users, MessageSquare, ShieldCheck, Clock } from "lucide-react"

function Counter({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) {
  const [count, setCount] = useState(0)
  const countRef = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (countRef.current) {
      observer.observe(countRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4)
      
      setCount(Math.floor(easeOutQuart(percentage) * end))

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, end, duration])

  return (
    <span ref={countRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    {
      value: 1000,
      suffix: "+",
      label: "Active Users",
      sublabel: "this week",
      icon: <Users className="w-8 h-8 text-purple-400 animate-pulse" />,
    },
    {
      value: 5000,
      suffix: "+",
      label: "Messages Sent",
      sublabel: "& vanished forever",
      icon: <MessageSquare className="w-8 h-8 text-pink-400 animate-bounce" />,
    },
    {
      value: 100,
      suffix: "%",
      label: "Privacy",
      sublabel: "zero logs",
      icon: <ShieldCheck className="w-8 h-8 text-green-400 animate-[pulse_3s_ease-in-out_infinite]" />,
    },
    {
      value: 10,
      suffix: " min",
      label: "Auto-Delete",
      sublabel: "no exceptions",
      icon: <Clock className="w-8 h-8 text-orange-400 animate-[spin_10s_linear_infinite]" />,
    },
  ]

  return (
    <section ref={sectionRef} className="py-16 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="stats-header inline-block px-4 py-2 bg-green-500/10 text-green-400 text-sm font-medium rounded-full mb-4">
            📈 Growing Fast
          </span>
          <h2 className="stats-header text-2xl md:text-4xl font-bold text-[var(--foreground)]">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
              Privacy-First
            </span>{" "}
            Users
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`stat-card p-6 md:p-8 bg-card-bg/50 border border-card-border rounded-2xl hover:border-purple-500 transition-all duration-500 group relative overflow-hidden shadow-sm dark:shadow-none
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 inline-block p-3 rounded-full bg-card-border group-hover:bg-muted/20 transition-colors duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl md:text-3xl font-bold mb-1 text-foreground">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-foreground font-medium text-sm">
                {stat.label}
              </div>
              <div className="text-muted text-xs mt-1">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          {[
            "No Data Collection",
            "Open Source Friendly",
            "End-to-End Encrypted"
          ].map((badge, index) => (
            <div 
              key={badge}
              className={`stats-badge flex items-center gap-2 px-4 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-full text-sm text-[var(--muted)] transition-all duration-500 delay-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
              `}
              style={{ transitionDelay: `${500 + (index * 100)}ms` }}
            >
              <span className="text-green-400">✓</span>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
