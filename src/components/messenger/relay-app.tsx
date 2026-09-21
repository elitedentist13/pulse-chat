"use client"

import { ChatList } from "@/components/messenger/chat-list"
import { Conversation } from "@/components/messenger/conversation"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

export function RelayApp() {
  const { activeChat } = useMessenger()

  useEffect(() => {
    document.documentElement.dataset.relay = "ready"
  }, [])

  return (
    <div className="flex h-dvh min-h-0 bg-[#0b141a] text-[#e9edef]">
      <ChatList
        className={cn(
          "w-full md:max-w-[420px] md:min-w-[340px]",
          activeChat ? "hidden md:flex" : "flex"
        )}
      />
      <Conversation
        className={cn(activeChat ? "flex" : "hidden md:flex")}
      />
    </div>
  )
}
