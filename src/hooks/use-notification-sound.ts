"use client"

import { useCallback, useRef } from "react"

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playSound = useCallback(() => {
    try {
      // Create audio element lazily
      if (!audioRef.current) {
        audioRef.current = new Audio("/sound/notification.mp3")
        audioRef.current.volume = 0.5
      }
      
      // Play sound (handle autoplay restrictions)
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {
        // Ignore autoplay errors (user hasn't interacted yet)
      })
    } catch {
      // Ignore audio errors
    }
  }, [])

  return { playSound }
}
