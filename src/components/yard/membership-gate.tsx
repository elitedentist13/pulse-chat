"use client"

import { PrivacyField } from "@/components/yard/privacy-field"
import { LocaleSwitch } from "@/components/yard/locale-switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DEFAULT_MEMBER_SHOW } from "@/lib/member"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import type { MemberShow } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useState } from "react"

type Mode = "login" | "create"

export function MembershipGate() {
  const { registerMember, loginMember } = useMessenger()
  const { t } = useLocale()
  const [mode, setMode] = useState<Mode>("login")
  const [realName, setRealName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [dob, setDob] = useState("")
  const [show, setShow] = useState<MemberShow>(DEFAULT_MEMBER_SHOW)
  const [error, setError] = useState("")

  function patchShow(key: keyof MemberShow, value: boolean) {
    setShow((current) => ({ ...current, [key]: value }))
  }

  function submit(event: React.FormEvent) {
    event.preventDefault()
    setError("")
    if (mode === "login") {
      const result = loginMember({ phone, dob })
      if (result === "invalid") setError(t("gateNeedLogin"))
      if (result === "unknown") setError(t("gateUnknown"))
      return
    }
    const result = registerMember({ realName, displayName, phone, dob, show })
    if (result === "invalid") setError(t("gateNeedFields"))
    if (result === "exists") setError(t("gateExists"))
  }

  return (
    <div
      data-membership-gate
      data-gate-mode={mode}
      className="flex min-h-dvh items-center justify-center bg-[#f6f1e8] px-4 py-10 text-[#1c1814]"
    >
      <div className="w-full max-w-md rounded-[1.8rem] border border-[#e0d6c8] bg-[#fbf7f0] p-6 shadow-[0_20px_50px_rgba(60,40,20,0.06)] md:p-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading text-4xl leading-none">{t("gateTitle")}</p>
            <p className="mt-2 text-sm leading-6 text-[#6e6458]">{t("gateBlurb")}</p>
          </div>
          <LocaleSwitch />
        </div>

        <div className="mt-6 flex rounded-full bg-[#e7dccb] p-[3px]" role="tablist">
          <button
            type="button"
            role="tab"
            data-gate-tab="login"
            aria-selected={mode === "login"}
            onClick={() => {
              setMode("login")
              setError("")
            }}
            className={cn(
              "flex-1 rounded-full py-1.5 text-sm",
              mode === "login" ? "bg-[#fbf7f0] text-[#1c1814]" : "text-[#6e6458]"
            )}
          >
            {t("gateLogin")}
          </button>
          <button
            type="button"
            role="tab"
            data-gate-tab="create"
            aria-selected={mode === "create"}
            onClick={() => {
              setMode("create")
              setError("")
            }}
            className={cn(
              "flex-1 rounded-full py-1.5 text-sm",
              mode === "create" ? "bg-[#fbf7f0] text-[#1c1814]" : "text-[#6e6458]"
            )}
          >
            {t("gateCreate")}
          </button>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={submit}>
          {mode === "create" ? (
            <>
              <PrivacyField
                name="realName"
                label={t("fieldRealName")}
                value={realName}
                onChange={setRealName}
                shown={show.realName}
                onShown={(value) => patchShow("realName", value)}
                placeholder={t("realNamePlaceholder")}
              />
              <PrivacyField
                name="displayName"
                label={t("fieldDisplayName")}
                value={displayName}
                onChange={setDisplayName}
                shown={show.displayName}
                onShown={(value) => patchShow("displayName", value)}
                placeholder={t("displayNamePlaceholder")}
              />
            </>
          ) : null}

          {mode === "create" ? (
            <>
              <PrivacyField
                name="phone"
                label={t("fieldPhone")}
                value={phone}
                onChange={setPhone}
                shown={show.phone}
                onShown={(value) => patchShow("phone", value)}
                placeholder={t("phonePlaceholder")}
              />
              <PrivacyField
                name="dob"
                label={t("fieldDob")}
                type="date"
                value={dob}
                onChange={setDob}
                shown={show.dob}
                onShown={(value) => patchShow("dob", value)}
              />
            </>
          ) : (
            <>
              <label className="grid gap-1.5 text-sm">
                {t("fieldPhone")}
                <Input
                  data-member-field="phone"
                  value={phone}
                  placeholder={t("phonePlaceholder")}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </label>
              <label className="grid gap-1.5 text-sm">
                {t("fieldDob")}
                <Input
                  data-member-field="dob"
                  type="date"
                  value={dob}
                  onChange={(event) => setDob(event.target.value)}
                />
              </label>
            </>
          )}

          {mode === "login" ? (
            <p className="text-xs text-[#6e6458]">{t("gateNeedLogin")}</p>
          ) : (
            <p className="text-xs text-[#6e6458]">{t("privacyHint")}</p>
          )}

          {error ? (
            <p data-gate-error className="text-sm text-[#9f2d2d]">
              {error}
            </p>
          ) : null}

          <Button type="submit" data-gate-submit className="h-10 rounded-full">
            {mode === "login" ? t("loginCta") : t("joinCta")}
          </Button>
        </form>
      </div>
    </div>
  )
}
