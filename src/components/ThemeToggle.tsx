"use client"

import { useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { InfoModal } from "@/components/InfoModal"
import { Sun, Moon, Info } from "lucide-react"

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [showInfoModal, setShowInfoModal] = useState(false)

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <button className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
          <Info className="w-5 h-5 text-zinc-500 opacity-0" />
        </button>
        <button className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
          <Moon className="w-5 h-5 text-zinc-500 opacity-0" />
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowInfoModal(true)}
          className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
          title="About ghost"
        >
          <Info className="w-5 h-5 text-zinc-400" />
        </button>
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-purple-400" />
          )}
        </button>
      </div>

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </>
  )
}
