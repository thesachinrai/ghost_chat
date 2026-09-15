"use client"
import { useUsername } from "@/hooks/use-username"
import { client } from "@/lib/client"
import { useMutation } from "@tanstack/react-query"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useEffect, useRef } from "react"
import { JoinRoomModal } from "@/components/JoinRoomModal"
import { gsap } from "gsap"
import { RoomCreationLoader } from "@/components/RoomCreationLoader"

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  )
}
export default Page

function Lobby() {
  const { username } = useUsername()
  const router = useRouter()
  const [showJoinModal, setShowJoinModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const ghostRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const alertRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()

  const wasDestroyed = searchParams.get("destroyed") === "true"
  const error = searchParams.get("error")

  const { mutate: createRoom, isPending } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create()
      if (res.status === 200 && res.data) {
        // Store passcode in sessionStorage for the room page to access
        sessionStorage.setItem(`passcode:${res.data.roomId}`, res.data.passcode)
        router.push(`/room/${res.data.roomId}`)
      }
    },
  })

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Ghost floating animation
      gsap.to(ghostRef.current, {
        y: -5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })

      // Entrance animations
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(
        ghostRef.current,
        { scale: 0, opacity: 0, rotation: -180 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.8 }
      )
        .fromTo(
          titleRef.current,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6 },
          "-=0.3"
        )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.2"
        )
        
      if (alertRef.current) {
        tl.fromTo(
          alertRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5 },
          "-=0.3"
        )

        // Auto-dismiss the alert after 4 seconds
        gsap.to(alertRef.current, {
          y: -10,
          opacity: 0,
          duration: 0.5,
          delay: 4,
          onComplete: () => {
            router.replace("/room")
          }
        })
      }

      tl.fromTo(
          cardRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.2"
        )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <main ref={containerRef} className="flex min-h-screen flex-col items-center justify-center p-4 bg-[var(--background)] overflow-hidden relative">
      {isPending && <RoomCreationLoader />}

      {/* Back to home */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 z-10 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors cursor-pointer flex items-center gap-1 text-sm"
      >
        <span className="text-lg">←</span> Home
      </button>

      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--ash-grey)]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--dust-grey)]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {wasDestroyed && (
          <div ref={alertRef} className="bg-[#a27c73]/10 border border-[#a27c73]/30 p-4 rounded-xl text-center opacity-0 backdrop-blur-md">
            <p className="text-[#a27c73] text-sm font-bold uppercase tracking-widest">Room Destroyed</p>
            <p className="text-[#a27c73]/80 text-xs mt-1">
              All messages were permanently deleted.
            </p>
          </div>
        )}

        {error === "room-not-found" && (
          <div ref={alertRef} className="bg-[#a27c73]/10 border border-[#a27c73]/30 p-4 rounded-xl text-center opacity-0 backdrop-blur-md">
            <p className="text-[#a27c73] text-sm font-bold uppercase tracking-widest">Room Not Found</p>
            <p className="text-[#a27c73]/80 text-xs mt-1">
              This room may have expired or never existed.
            </p>
          </div>
        )}

        {error === "room-full" && (
          <div ref={alertRef} className="bg-[#a27c73]/10 border border-[#a27c73]/30 p-4 rounded-xl text-center opacity-0 backdrop-blur-md">
            <p className="text-[#a27c73] text-sm font-bold uppercase tracking-widest">Room Full</p>
            <p className="text-[#a27c73]/80 text-xs mt-1">
              This room is at maximum capacity.
            </p>
          </div>
        )}

        {error === "invalid-passcode" && (
          <div ref={alertRef} className="bg-[#a27c73]/10 border border-[#a27c73]/30 p-4 rounded-xl text-center opacity-0 backdrop-blur-md">
            <p className="text-[#a27c73] text-sm font-bold uppercase tracking-widest">Invalid Passcode</p>
            <p className="text-[#a27c73]/80 text-xs mt-1">
              The passcode you entered was incorrect.
            </p>
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span ref={ghostRef} className="inline-block text-[var(--foreground)] opacity-0">👻</span>{" "}
            <span ref={titleRef} className="inline-block bg-gradient-to-r from-[var(--foreground)] to-[var(--grey-olive)] bg-clip-text text-transparent opacity-0">
              Ghost
            </span>
          </h1>
          <p ref={subtitleRef} className="text-[var(--muted)] text-sm opacity-0">Create or join a secure room</p>
        </div>

        <div ref={cardRef} className="border border-[var(--card-border)] bg-[var(--card-bg)] p-6 backdrop-blur-md opacity-0">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="flex items-center text-[var(--muted)]">Your Identity</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-[var(--background)] border border-[var(--card-border)] p-3 text-sm text-[var(--muted)] font-mono">
                  {username}
                </div>
              </div>
            </div>

            <button
              onClick={() => createRoom()}
              disabled={isPending}
              className="w-full bg-[var(--foreground)] text-[var(--background)] p-3 text-sm font-bold hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending ? "CREATING..." : "CREATE SECURE ROOM"}
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full bg-[var(--grey-olive)] hover:bg-[var(--ash-grey)] text-[var(--background)] p-3 text-sm font-bold transition-colors cursor-pointer"
            >
              JOIN A ROOM
            </button>
          </div>
        </div>
      </div>
      <JoinRoomModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </main>
  )
}