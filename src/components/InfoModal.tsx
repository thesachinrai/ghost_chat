"use client"

import { createPortal } from "react-dom"
import { useEffect, useState } from "react"
import { Flame, FileKey, ShieldCheck, Zap, Palette, Heart, X } from "lucide-react"

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const changelog = [
    {
      version: "1.0.1",
      date: "Dec 11, 2025",
      changes: [
        "Optimized text readability for Light Mode across Feature Section.",
        "Redesigned feature badges: New outlined style with transparent backgrounds.",
        "Standardized UI consistency: Unified border radius and shadow effects."
      ]
    },
    {
      version: "1.0.0",
      date: "Dec 09, 2025",
      changes: [
        "Initial Release.",
        "Anonymous Chat: No accounts, no sign-ups, no tracking required.",
        "Self-Destructing Messages: Rooms and messages self-destruct after 10 minutes.",
        "Passcode Protected: Rooms are secured with a random 6-digit passcode.",
        "End-to-End Encrypted: All messages are encrypted for maximum privacy.",
        "Real-Time Messaging: Instant messaging with live typing indicators.",
        "Dark & Light Mode: Choose your preferred theme for comfortable chatting."
      ]
    }
  ]

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-card-bg border border-card-border rounded-2xl p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto shadow-2xl [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-foreground/50 hover:[&::-webkit-scrollbar-thumb]:bg-foreground">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-bounce">👻</span>
            <div>
              <h2 className="text-lg font-bold text-foreground">ghost Chat</h2>
              <p className="text-xs text-foreground">Version 1.0.1</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-foreground hover:text-foreground transition-colors cursor-pointer p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>



        <div className="space-y-1 mb-6 mt-8">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Changelog
          </h3>
          <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </div>

        <div className="space-y-6">
          {changelog.map((release, index) => (
            <div key={index} className="relative pl-4 border-l-2 border-foreground/20">
              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-foreground border-2 border-card-bg"></div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-foreground">v{release.version}</span>
                <span className="text-xs text-foreground">{release.date}</span>
              </div>
              <ul className="space-y-1.5">
                {release.changes.map((change, i) => (
                  <li key={i} className="text-xs text-foreground flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground shrink-0" />
                    <span className="leading-relaxed">{change}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-card-border text-center">
          <p className="text-xs text-foreground flex items-center justify-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" /> by{" "}
            <a
              href="https://devzahid.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-500 hover:text-purple-400 transition-colors font-medium hover:underline"
            >
              Zahid
            </a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
