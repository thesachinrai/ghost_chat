"use client"
import { useState, useEffect, useRef } from "react"
import { Zap, Bell, PencilLine } from "lucide-react"

export function RealTimeCard() {
  const allConversations = [
    [
      { sender: "them", text: "Is this channel secure?" },
      { sender: "you", text: "End-to-end encrypted." },
      { sender: "them", text: "No logs? No traces?" },
      { sender: "you", text: "Nothing. Completely anonymous." },
      { sender: "them", text: "How long until it deletes?" },
      { sender: "you", text: "10 minutes after we leave." }
    ]
  ]
  const [chatMessages, setChatMessages] = useState(allConversations[0])
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])
  const [isThemTyping, setIsThemTyping] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [visibleMessages, isThemTyping])

  useEffect(() => {
    let messageIndex = 0
    let timeoutId: NodeJS.Timeout
    let currentConversation = chatMessages
    
    const runConversation = () => {
      if (messageIndex >= currentConversation.length) {
        timeoutId = setTimeout(() => {
          setVisibleMessages([])
          setInputText("")
          setIsThemTyping(false)
          messageIndex = 0
          runConversation()
        }, 3000)
        return
      }
      
      const msg = currentConversation[messageIndex]
      const currentIndex = messageIndex
      
      if (msg.sender === 'them') {
        setIsThemTyping(true)
        timeoutId = setTimeout(() => {
          setIsThemTyping(false)
          setVisibleMessages(prev => [...prev, currentIndex])
          messageIndex++
          timeoutId = setTimeout(runConversation, 1500)
        }, 1200)
      } else {
        let i = 0
        const text = msg.text
        const typeNextChar = () => {
          if (i <= text.length) {
            setInputText(text.substring(0, i))
            i++
            timeoutId = setTimeout(typeNextChar, 70)
          } else {
            setIsSending(true)
            timeoutId = setTimeout(() => {
              setIsSending(false)
              setInputText("")
              setVisibleMessages(prev => [...prev, currentIndex])
              messageIndex++
              timeoutId = setTimeout(runConversation, 1500)
            }, 300)
          }
        }
        timeoutId = setTimeout(typeNextChar, 500)
      }
    }
    timeoutId = setTimeout(runConversation, 1000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div className="premium-card md:col-span-2 p-6 md:p-10 relative overflow-hidden group">
      <div className="relative z-10 grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">Real-Time Messaging</h3>
          <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">Instant message delivery with live typing indicators. See when others are composing their thoughts seamlessly.</p>
          
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-[var(--dust-grey)]/30 border border-[var(--dust-grey)] rounded-md text-[var(--foreground)] text-xs flex items-center gap-2">
              <Zap className="w-3 h-3 text-[var(--grey-olive)]" /> Instant
            </span>
            <span className="px-3 py-1.5 bg-[var(--dust-grey)]/30 border border-[var(--dust-grey)] rounded-md text-[var(--foreground)] text-xs flex items-center gap-2">
              <Bell className="w-3 h-3 text-[var(--grey-olive)]" /> Notifications
            </span>
            <span className="px-3 py-1.5 bg-[var(--dust-grey)]/30 border border-[var(--dust-grey)] rounded-md text-[var(--foreground)] text-xs flex items-center gap-2">
              <PencilLine className="w-3 h-3 text-[var(--grey-olive)]" /> Typing indicator
            </span>
          </div>
        </div>
        
        <div className="bg-white/40 border border-[var(--dust-grey)] rounded-xl overflow-hidden flex flex-col h-[280px] shadow-inner">
          <div 
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto scrollbar-hide space-y-4"
          >
            {chatMessages.map((msg, i) => (
              visibleMessages.includes(i) && (
                <div key={i} className={`flex flex-col ${msg.sender === 'you' ? 'items-end' : 'items-start'}`}>
                  <div className="max-w-[90%]">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className={`text-[10px] font-semibold tracking-widest uppercase ${msg.sender === 'you' ? 'text-[var(--foreground)]' : 'text-[var(--grey-olive)]'}`}>
                        {msg.sender === 'you' ? 'YOU' : 'anonymous-hawk'}
                      </span>
                    </div>
                    <p className={`text-sm px-3 py-2 rounded-lg border ${msg.sender === 'you' ? 'bg-[var(--dust-grey)]/40 border-[var(--dust-grey)] text-[var(--foreground)]' : 'bg-[var(--ivory-mist)]/80 border-[var(--dust-grey-2)] text-[var(--muted-foreground)]'}`}>
                      {msg.text}
                    </p>
                  </div>
                </div>
              )
            ))}
            
            {visibleMessages.length === 0 && !isThemTyping && (
              <div className="flex items-center justify-center h-full">
                <p className="text-[var(--ash-grey)] text-sm font-mono">Awaiting secure connection...</p>
              </div>
            )}
          </div>
          
          <div className="px-4 h-6 flex items-center">
            {isThemTyping && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-[var(--grey-olive)]">anonymous-hawk</span>
                <span className="text-[10px] uppercase tracking-widest text-[var(--muted)]">is typing</span>
                <span className="flex gap-1">
                  <span className="w-1 h-1 bg-[var(--grey-olive)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1 h-1 bg-[var(--grey-olive)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1 h-1 bg-[var(--grey-olive)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              </div>
            )}
          </div>
          
          <div className="p-3 pt-0 border-t border-[var(--dust-grey)] bg-[var(--ivory-mist)]/30">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--grey-olive)]">{">"}</span>
                <input
                  type="text"
                  value={inputText}
                  placeholder="Type message..."
                  readOnly
                  className="w-full bg-[var(--ivory-mist)]/60 border border-[var(--dust-grey)] rounded-md px-3 py-2 pl-7 text-sm text-[var(--foreground)] placeholder:text-[var(--ash-grey)] focus:outline-none"
                />
              </div>
              <button className={`px-4 py-2 text-xs font-semibold tracking-widest uppercase rounded-md transition-all duration-150 ${
                isSending 
                  ? 'bg-[var(--grey-olive)] text-[var(--ivory-mist)] scale-95' 
                  : inputText 
                    ? 'bg-[var(--foreground)] text-[var(--ivory-mist)] hover:bg-[var(--grey-olive)]' 
                    : 'bg-[var(--dust-grey)] text-[var(--ash-grey)]'
              }`}>
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}