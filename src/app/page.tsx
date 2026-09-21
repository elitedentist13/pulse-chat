import { KithApp } from "@/components/messenger/kith-app"
import { MessengerProvider } from "@/lib/messenger-store"

export default function Home() {
  return (
    <MessengerProvider>
      <KithApp />
    </MessengerProvider>
  )
}
