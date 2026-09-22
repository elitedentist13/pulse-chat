"use client"

import { PrivacyField } from "@/components/yard/privacy-field"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/lib/locale"
import { useMessenger } from "@/lib/messenger-store"
import type { Member } from "@/lib/types"
import { useState } from "react"

export function MemberCard() {
  const { state, saveMember } = useMessenger()
  const member = state.member
  if (!member) return null
  return <MemberCardForm key={member.id} member={member} onSave={saveMember} />
}

function MemberCardForm({
  member,
  onSave,
}: {
  member: Member
  onSave: (member: Member) => void
}) {
  const { t } = useLocale()
  const [realName, setRealName] = useState(member.realName)
  const [displayName, setDisplayName] = useState(member.displayName)
  const [phone, setPhone] = useState(member.phone)
  const [dob, setDob] = useState(member.dob)
  const [show, setShow] = useState(member.show)

  return (
    <form
      data-member-card
      className="grid gap-3 px-5 py-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSave({
          ...member,
          realName,
          displayName,
          phone,
          dob,
          show,
        })
      }}
    >
      <p className="font-heading text-lg">{t("yourMembership")}</p>
      <p className="text-xs text-[#6e6458]">{t("privacyHint")}</p>
      <PrivacyField
        name="realName"
        label={t("fieldRealName")}
        value={realName}
        onChange={setRealName}
        shown={show.realName}
        onShown={(value) => setShow({ ...show, realName: value })}
      />
      <PrivacyField
        name="displayName"
        label={t("fieldDisplayName")}
        value={displayName}
        onChange={setDisplayName}
        shown={show.displayName}
        onShown={(value) => setShow({ ...show, displayName: value })}
      />
      <PrivacyField
        name="phone"
        label={t("fieldPhone")}
        value={phone}
        onChange={setPhone}
        shown={show.phone}
        onShown={(value) => setShow({ ...show, phone: value })}
      />
      <PrivacyField
        name="dob"
        label={t("fieldDob")}
        type="date"
        value={dob}
        onChange={setDob}
        shown={show.dob}
        onShown={(value) => setShow({ ...show, dob: value })}
      />
      <Button type="submit" data-member-save className="rounded-full">
        {t("savePrivacy")}
      </Button>
    </form>
  )
}
