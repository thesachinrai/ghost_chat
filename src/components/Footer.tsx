import { ShieldCheck, Wind } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-6 px-4 border-t border-[var(--card-border)] bg-[var(--background)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-[var(--muted)] font-mono uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[var(--accent)]" /> E2E Encrypted
          </span>
          <span className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-[var(--accent-secondary)]" /> Ephemeral
          </span>
        </div>
        <div className="mt-4 md:mt-0 opacity-50">
          STATUS: ANONYMOUS
        </div>
      </div>
    </footer>
  )
}