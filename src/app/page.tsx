import { RelayApp } from "@/components/messenger/relay-app"
import { MessengerProvider } from "@/lib/messenger-store"

export default function Home() {
  return (
    <MessengerProvider>
      <RelayApp />
    </MessengerProvider>
  )
}
