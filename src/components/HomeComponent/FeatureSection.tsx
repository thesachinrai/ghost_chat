"use client"
import { forwardRef } from "react"
import { ShieldCheck } from "lucide-react"
import {
  SelfDestructCard,
  EncryptionCard,
  PasscodeCard,
  AnonymousCard,
  RealTimeCard,
} from "./FeatureSectionComponent"

export const FeatureSection = forwardRef<HTMLElement>(
  function FeatureSection(props, ref) {
    return (
      <section
        ref={ref as React.RefObject<HTMLElement>}
        className="py-20 px-4 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            {/* Premium Earthy Status Badge */}
            <span className="section-header inline-flex items-center gap-2 px-4 py-1.5 border border-[var(--ash-grey)] bg-[var(--dust-grey)]/30 backdrop-blur-md text-xs font-medium text-[var(--foreground)] uppercase tracking-widest rounded-full mb-4 opacity-0">
              <ShieldCheck className="w-4 h-4 text-[var(--grey-olive)]" /> Built for Privacy
            </span>
            
            <h2 className="section-header text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4 opacity-0 tracking-tight">
              Essential tools for{" "}
              {/* Earthy accent instead of bright green */}
              <span className="text-[var(--grey-olive)] italic font-serif">
                your privacy
              </span>
            </h2>
            
            <p className="section-header text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg opacity-0 font-light">
              Built for privacy-conscious conversations that leave no digital footprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelfDestructCard />
            <EncryptionCard />
            <PasscodeCard />
            <AnonymousCard />
            <RealTimeCard />
          </div>
        </div>
      </section>
    )
  }
)