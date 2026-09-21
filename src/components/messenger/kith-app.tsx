"use client"

import { ChatList } from "@/components/messenger/chat-list"
import { Conversation } from "@/components/messenger/conversation"
import { CareDesk } from "@/components/yard/care-desk"
import { DayPage } from "@/components/yard/day-page"
import { Porch } from "@/components/yard/porch"
import { ProfileDesk } from "@/components/yard/profile-desk"
import { TalentDesk } from "@/components/yard/talent-desk"
import { YardSpine } from "@/components/yard/yard-spine"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

export function KithApp() {
  const { activeChat, state } = useMessenger()
  const surface = state.surface
  const tab = state.petTab

  useEffect(() => {
    document.documentElement.dataset.kith = "ready"
    document.documentElement.dataset.surface = surface
    document.documentElement.dataset.petTab = tab
  }, [surface, tab])

  const petPane =
    tab === "profile" ? (
      <ProfileDesk className={paneClass(state.yardFocus)} />
    ) : tab === "care" ? (
      <CareDesk className={paneClass(state.yardFocus)} />
    ) : tab === "talent" ? (
      <TalentDesk className={paneClass(state.yardFocus)} />
    ) : (
      <DayPage className={paneClass(state.yardFocus)} />
    )

  return (
    <div className="flex h-dvh min-h-0 bg-[#f6f1e8] text-[#1c1814]">
      {surface === "notes" ? (
        <>
          <ChatList
            className={cn(
              "w-full md:max-w-[380px] md:min-w-[320px]",
              activeChat ? "hidden md:flex" : "flex"
            )}
          />
          <Conversation
            className={cn(activeChat ? "flex" : "hidden md:flex")}
          />
        </>
      ) : null}

      {surface === "daybook" ? (
        <>
          <YardSpine
            className={cn(
              "w-full md:max-w-[380px] md:min-w-[320px]",
              state.yardFocus === "page" ? "hidden md:flex" : "flex"
            )}
          />
          {petPane}
        </>
      ) : null}

      {surface === "porch" ? <Porch className="flex" /> : null}
    </div>
  )
}

function paneClass(focus: "index" | "page") {
  return cn(focus === "page" ? "flex" : "hidden md:flex")
}
