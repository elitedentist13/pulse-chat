"use client"

import { AppNav } from "@/components/yard/app-nav"
import { PetTabs } from "@/components/yard/pet-tabs"
import { PortraitButton } from "@/components/yard/portrait-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { MessageKey } from "@/lib/i18n"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

const SUGGESTIONS: {
  name: MessageKey
  cue: MessageKey
  description: MessageKey
}[] = [
  { name: "suggestionStand", cue: "cueStand", description: "descStand" },
  { name: "suggestionHand", cue: "cueHand", description: "descHand" },
  { name: "suggestionSpeak", cue: "cueSpeak", description: "descSpeak" },
  { name: "suggestionSpin", cue: "cueSpin", description: "descSpin" },
]

export function TalentDesk({ className }: { className?: string }) {
  const {
    activePet,
    changePortrait,
    talentsFor,
    saveTalent,
    deleteTalent,
    setYardFocus,
  } = useMessenger()
  const { t } = useLocale()
  const [name, setName] = useState("")
  const [cue, setCue] = useState("")
  const [description, setDescription] = useState("")

  if (!activePet) {
    return (
      <section className={cn("stage-paper flex flex-1 items-center justify-center", className)}>
        <p className="text-sm text-[#6e6458]">{t("chooseCompanion")}</p>
      </section>
    )
  }

  const talents = talentsFor(activePet.id)

  return (
    <section
      data-talent-desk
      className={cn("flex h-full min-h-0 flex-1 flex-col bg-[#faf7f1]", className)}
    >
      <header className="border-b border-[#e0d6c8] bg-[#fbf7f0] px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setYardFocus("index")}
            aria-label={t("back")}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <PortraitButton
            pet={activePet}
            size="md"
            onPick={(file) => void changePortrait(file)}
          />
          <div className="min-w-0 flex-1">
            <p className="font-heading text-xl">
              {t("talentsTitle", { name: activePet.name })}
            </p>
            <p className="text-xs text-[#6e6458]">{t("talentsBlurb")}</p>
          </div>
        </div>
        <PetTabs className="mt-3" />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((item) => (
              <Button
                key={item.name}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setName(t(item.name))
                  setCue(t(item.cue))
                  setDescription(t(item.description))
                }}
              >
                {t(item.name)}
              </Button>
            ))}
          </div>

          <ul className="space-y-2">
            {talents.length === 0 ? (
              <li className="rounded-[1.4rem] border border-dashed border-[#e0d6c8] px-4 py-6 text-sm text-[#6e6458]">
                {t("talentEmpty")}
              </li>
            ) : (
              talents.map((talent) => (
                <li
                  key={talent.id}
                  data-talent={talent.id}
                  className="rounded-[1.4rem] border border-[#e0d6c8] bg-white px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-heading text-lg">{talent.name}</p>
                    <p className="text-xs tracking-[0.14em] text-[#6e6458] uppercase">
                      {talent.cue}
                    </p>
                  </div>
                  <p className="mt-1 text-sm leading-6">{talent.description}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-1"
                    onClick={() => deleteTalent(talent.id)}
                  >
                    {t("forgetTalent")}
                  </Button>
                </li>
              ))
            )}
          </ul>

          <div className="mt-5 grid gap-2 rounded-[1.4rem] border border-dashed border-[#e0d6c8] bg-[#fbf7f0] px-4 py-3">
            <Input
              placeholder={t("talentName")}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              placeholder={t("talentCue")}
              value={cue}
              onChange={(event) => setCue(event.target.value)}
            />
            <Textarea
              placeholder={t("talentLooks")}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
            <Button
              type="button"
              onClick={() => {
                if (!name.trim()) return
                saveTalent({
                  petId: activePet.id,
                  name: name.trim(),
                  cue: cue.trim() || "—",
                  description: description.trim(),
                })
                setName("")
                setCue("")
                setDescription("")
              }}
            >
              {t("keepTalent")}
            </Button>
          </div>
        </div>
      </div>
      <div className="border-t border-[#e0d6c8] px-4 py-3 md:hidden">
        <AppNav />
      </div>
    </section>
  )
}
