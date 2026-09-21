import { KithApp } from "@/components/messenger/kith-app"
import { LocaleProvider } from "@/lib/locale"
import { MessengerProvider } from "@/lib/messenger-store"

export default function Home() {
  return (
    <LocaleProvider>
      <MessengerProvider>
        <KithApp />
      </MessengerProvider>
    </LocaleProvider>
  )
}
