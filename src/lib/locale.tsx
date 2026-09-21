"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import {
  guessLocale,
  isLocale,
  localeTag,
  LOCALE_STORAGE_KEY,
  translate,
  type Locale,
  type MessageKey,
} from "@/lib/i18n"

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  tag: string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const listeners = new Set<() => void>()
let current: Locale = "en"
let didRead = false

function readStored(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(stored)) return stored
  } catch {
    // Private mode can refuse storage.
  }
  return guessLocale(window.navigator.language)
}

function emit() {
  for (const listener of listeners) listener()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  if (!didRead) {
    didRead = true
    current = readStored()
  }
  return current
}

function getServerSnapshot(): Locale {
  return "en"
}

function writeLocale(next: Locale) {
  current = next
  didRead = true
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch {
    // Private mode can refuse storage.
  }
  emit()
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.lang = localeTag(locale)
    document.documentElement.dataset.locale = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    writeLocale(next)
  }, [])

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, tag: localeTag(locale) }),
    [locale, setLocale, t]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) {
    throw new Error("useLocale must be used inside LocaleProvider")
  }
  return value
}
