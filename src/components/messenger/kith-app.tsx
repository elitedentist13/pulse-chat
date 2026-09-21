"use client"

import { ChatList } from "@/components/messenger/chat-list"
import { Conversation } from "@/components/messenger/conversation"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

export function KithApp() {
  const { activeChat } = useMessenger()

  useEffect(() => {
    document.documentElement.dataset.kith = "ready"
  }, [])

  return (
    <div className="flex h-dvh min-h-0 bg-[#f6f1e8] text-[#1c1814]">
      <ChatList
        className={cn(
          "w-full md:max-w-[380px] md:min-w-[320px]",
          activeChat ? "hidden md:flex" : "flex"
        )}
      />
      <Conversation
        className={cn(activeChat ? "flex" : "hidden md:flex")}
      />
    </div>
  )
}
