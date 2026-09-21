#!/usr/bin/env node
/**
 * Live smoke / spot / API / CDP Runtime.evaluate / client tests
 * against the Kith server on 43217.
 */
import { createRequire } from "node:module"
import { writeFileSync } from "node:fs"

const require = createRequire(import.meta.url)
const puppeteer = require("puppeteer-core")

const BASE = process.env.KITH_URL ?? "http://127.0.0.1:43217"
const CHROME = process.env.CHROME ?? "/usr/bin/google-chrome-stable"

const results = []

function record(suite, name, ok, detail = "") {
  results.push({ suite, name, ok, detail: String(detail ?? "") })
  const mark = ok ? "PASS" : "FAIL"
  console.log(`${mark}  [${suite}] ${name}${detail ? ` — ${detail}` : ""}`)
}

async function api(path, expect = 200) {
  const url = `${BASE}${path}`
  const started = Date.now()
  const response = await fetch(url, { redirect: "manual" })
  const text = await response.text()
  const ms = Date.now() - started
  return {
    url,
    status: response.status,
    headers: response.headers,
    text,
    ms,
    ok: response.status === expect,
  }
}

async function main() {
  console.log(`\nKith live tests → ${BASE}\n`)

  const home = await api("/")
  record("api", "GET / is 200", home.ok, `${home.status} in ${home.ms}ms`)
  record("api", "GET / is HTML", home.text.includes("<!DOCTYPE html>") && home.text.includes("Kith"))
  record(
    "api",
    "GET / content-type html",
    (home.headers.get("content-type") ?? "").includes("text/html")
  )
  const missing = await api("/no-such-route-kith", 404)
  record("api", "GET unknown route 404", missing.ok, `${missing.status}`)
  const favicon = await api("/favicon.ico")
  record(
    "api",
    "GET /favicon.ico",
    favicon.status === 200 || favicon.status === 404,
    `${favicon.status}`
  )
  const chunk = home.text.match(/\/_next\/static\/[^"']+\.js/)
  if (chunk) {
    const asset = await api(chunk[0])
    record("api", "GET Next.js chunk", asset.ok, `${chunk[0]} ${asset.status}`)
  } else {
    record("api", "GET Next.js chunk", false, "no /_next/static script in HTML")
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--window-size=1440,980"],
    defaultViewport: { width: 1440, height: 980 },
  })
  const page = await browser.newPage()
  const cdp = await page.createCDPSession()
  await cdp.send("Runtime.enable")

  async function evaluate(expression) {
    const { result, exceptionDetails } = await cdp.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    })
    if (exceptionDetails) {
      throw new Error(exceptionDetails.text || "Runtime.evaluate failed")
    }
    return result.value
  }

  async function tap(selector) {
    const clicked = await page.evaluate((sel) => {
      const node = document.querySelector(sel)
      if (!(node instanceof HTMLElement)) return false
      node.scrollIntoView({ block: "center", inline: "center" })
      node.click()
      return true
    }, selector)
    if (!clicked) throw new Error(`tap missed ${selector}`)
  }

  async function step(suite, name, fn) {
    try {
      const detail = await fn()
      record(suite, name, true, detail ?? "")
    } catch (error) {
      record(suite, name, false, error instanceof Error ? error.message : String(error))
    }
  }

  await page.goto(BASE, { waitUntil: "networkidle0" })
  await page.evaluate(() => {
    localStorage.removeItem("kith-daybook-v3")
    localStorage.removeItem("kith-locale")
  })
  await page.reload({ waitUntil: "networkidle0" })
  await page.waitForFunction(() => document.documentElement.dataset.kith === "ready")

  const runtime = await evaluate(`({
    ready: document.documentElement.dataset.kith,
    surface: document.documentElement.dataset.surface,
    petTab: document.documentElement.dataset.petTab,
    locale: document.documentElement.dataset.locale || document.documentElement.lang,
    title: document.title,
    spine: Boolean(document.querySelector("[data-yard-spine]")),
    day: Boolean(document.querySelector("[data-day-page]")),
    storage: Boolean(localStorage.getItem("kith-daybook-v3")),
    href: location.href,
  })`)
  record("cdp", "Runtime.evaluate returns object", Boolean(runtime))
  record("cdp", "dataset.kith === ready", runtime.ready === "ready", String(runtime.ready))
  record("cdp", "default surface is daybook", runtime.surface === "daybook", String(runtime.surface))
  record("cdp", "default pet tab is pages", runtime.petTab === "pages", String(runtime.petTab))
  record("cdp", "document title is Kith", runtime.title === "Kith")
  record("cdp", "spine and day page mounted", runtime.spine && runtime.day)
  record("cdp", "localStorage snapshot written", runtime.storage)
  record("cdp", "location is live origin", String(runtime.href).startsWith(BASE))

  const seed = await evaluate(`(() => {
    const raw = JSON.parse(localStorage.getItem("kith-daybook-v3") || "null")
    if (!raw) return null
    return {
      pets: raw.pets?.length ?? 0,
      juniper: raw.pets?.some((p) => p.id === "pet-juniper" && p.nickname === "June"),
      care: raw.careRecords?.length ?? 0,
      stories: raw.stories?.length ?? 0,
      entries: raw.entries?.length ?? 0,
      talents: raw.talents?.length ?? 0,
    }
  })()`)
  record("cdp", "seed has Juniper profile", Boolean(seed?.juniper), JSON.stringify(seed))
  record(
    "cdp",
    "seed has care, stories, pages, talents",
    Boolean(seed && seed.care >= 6 && seed.stories >= 1 && seed.entries >= 8 && seed.talents >= 3)
  )

  record(
    "smoke",
    "nav has Daybook Porch Notes",
    await page.$eval(
      "[data-app-nav]",
      (el) => /Daybook/.test(el.innerText) && /Porch/.test(el.innerText) && /Notes/.test(el.innerText)
    )
  )
  const localeIds = [
    ...new Set(
      await page.$$eval("[data-locale-switch] [data-locale]", (els) =>
        els.map((el) => el.getAttribute("data-locale"))
      )
    ),
  ].join(",")
  record("smoke", "locale switch EN 繁 简", localeIds === "en,zh-Hant,zh-Hans", localeIds)

  await step("spot", "profile shows Juniper dossier fields", async () => {
    await tap("[data-pet-tab='profile']")
    await page.waitForSelector("[data-profile-desk]")
    const profile = await page.$eval("[data-profile-desk]", (el) => el.innerText)
    if (!/Juniper/.test(profile) || !/Date of birth|Nickname|Traits|Medical remarks|Favourite food/.test(profile)) {
      throw new Error("missing dossier fields")
    }
    await page.screenshot({ path: "/opt/cursor/artifacts/live_test_profile.png" })
  })

  await step("spot", "Traditional Chinese profile labels", async () => {
    await tap("[data-locale='zh-Hant']")
    await page.waitForFunction(() => document.documentElement.dataset.locale === "zh-Hant")
    const hant = await evaluate(`document.querySelector("[data-profile-desk]")?.innerText || ""`)
    if (!/出生日期/.test(hant) || !/性情/.test(hant) || !/醫療備註/.test(hant)) {
      throw new Error("missing 繁 labels")
    }
  })

  await step("spot", "Simplified Chinese nav", async () => {
    await tap("[data-locale='zh-Hans']")
    await page.waitForFunction(() => document.documentElement.dataset.locale === "zh-Hans")
    const hansNav = await evaluate(`document.querySelector("[data-app-nav]")?.innerText || ""`)
    if (!/日记本/.test(hansNav) || !/门廊/.test(hansNav) || !/便笺/.test(hansNav)) {
      throw new Error(hansNav.slice(0, 80))
    }
    await tap("[data-locale='en']")
    await page.waitForFunction(() => document.documentElement.dataset.locale === "en")
  })

  await step("spot", "care subtabs present", async () => {
    await tap("[data-pet-tab='care']")
    await page.waitForSelector("[data-care-desk]")
    const subtabs = await page.$$eval("[data-care-subtab-btn]", (els) =>
      els.map((el) => el.getAttribute("data-care-subtab-btn"))
    )
    const need = ["prevent", "bowl", "visit", "blood", "receipt", "prescription", "groom", "food"]
    if (!need.every((id) => subtabs.includes(id))) throw new Error(subtabs.join(","))
    return subtabs.join(",")
  })

  await step("spot", "visit strip has dated captioned slip", async () => {
    await page.waitForSelector("[data-care-strip='visit']")
    const visit = await page.$eval("[data-care-strip='visit']", (el) => el.innerText)
    if (!/Annual \+ limp check/.test(visit) || !/2026/.test(visit)) throw new Error(visit.slice(0, 80))
  })

  await step("client", "lightbox opens on slip click", async () => {
    await tap("[data-care-slide-open]")
    await page.waitForSelector("[data-care-lightbox]")
  })

  await step("client", "lightbox save writes caption back to strip", async () => {
    const cap = await page.$("[data-slide-caption]")
    if (!cap) throw new Error("no caption field")
    await cap.click({ clickCount: 3 })
    await cap.type("Live-test visit")
    await tap("[data-slide-save]")
    await page.waitForFunction(() => !document.querySelector("[data-care-lightbox]"), {
      timeout: 8000,
    })
    await page.waitForFunction(() => !document.querySelector("[data-slot='dialog-overlay']"), {
      timeout: 8000,
    }).catch(() => null)
    const visitAfter = await page.$eval("[data-care-strip='visit']", (el) => el.innerText)
    if (!visitAfter.includes("Live-test visit")) throw new Error(visitAfter.slice(0, 80))
  })

  await step("spot", "groom strip has two slips", async () => {
    await tap("[data-care-subtab-btn='groom']")
    await page.waitForFunction(
      () => document.querySelector("[data-care-desk]")?.getAttribute("data-care-subtab") === "groom",
      { timeout: 8000 }
    )
    await page.waitForSelector("[data-care-strip='groom']")
    const groomCount = await page.$$eval("[data-care-strip='groom'] [data-care-slide]", (els) => els.length)
    if (groomCount < 2) throw new Error(String(groomCount))
    await page.screenshot({ path: "/opt/cursor/artifacts/live_test_care_groom.png" })
    return String(groomCount)
  })

  await step("spot", "preventatives tab lists ticks reminder", async () => {
    await tap("[data-care-subtab-btn='prevent']")
    await page.waitForSelector("[data-reminders]")
    const text = await page.$eval("[data-reminders]", (el) => el.innerText)
    if (!/Ticks/.test(text)) throw new Error(text.slice(0, 80))
  })

  await step("spot", "talent desk lists Stand and Give a hand", async () => {
    await tap("[data-pet-tab='talent']")
    await page.waitForSelector("[data-talent-desk]")
    const text = await page.$eval("[data-talent-desk]", (el) => el.innerText)
    if (!/Stand/.test(text) || !/Give a hand/.test(text)) throw new Error(text.slice(0, 80))
  })

  await step("client", "20s clip rejected at 15s cap", async () => {
    await tap("[data-pet-tab='pages']")
    await page.waitForSelector("[data-day-page]")
    await page.waitForSelector("[data-add-media] input")
    const mediaInput = await page.$("[data-add-media] input")
    if (!mediaInput) throw new Error("no media input")
    await mediaInput.uploadFile("/tmp/long-clip.mp4")
    await page.waitForSelector("[data-media-error]", { timeout: 15000 })
    const tooLong = await page.$eval("[data-media-error]", (el) => el.textContent || "")
    if (!/15 seconds/.test(tooLong)) throw new Error(tooLong)
    return tooLong
  })

  await step("client", "4s clip accepted on the page", async () => {
    const mediaInput = await page.$("[data-add-media] input")
    if (!mediaInput) throw new Error("no media input")
    await mediaInput.uploadFile("/tmp/short-clip.mp4")
    await page.waitForSelector("[data-media-kind='video']", { timeout: 15000 })
    await page.screenshot({ path: "/opt/cursor/artifacts/live_test_day_video.png" })
  })

  await step("client", "porch lists public pages", async () => {
    await tap("[data-surface-tab='porch']")
    await page.waitForSelector("[data-porch]")
    const porchCount = await page.$$eval("[data-porch-entry]", (els) => els.length)
    if (porchCount < 4) throw new Error(String(porchCount))
    return String(porchCount)
  })

  await step("client", "notes table is the adjunct", async () => {
    await tap("[data-surface-tab='notes']")
    await page.waitForFunction(() => document.documentElement.dataset.surface === "notes")
    const body = await page.evaluate(() => document.body.innerText)
    if (!/Notes/.test(body) || !/Open|Waiting|Hall/.test(body)) throw new Error("notes chrome missing")
  })

  await step("client", "hall shelves mount", async () => {
    await page.evaluate(() => {
      const marked = document.querySelector("[data-chat-filter='groups']")
      if (marked instanceof HTMLElement) {
        marked.click()
        return
      }
      const hall = [...document.querySelectorAll("button, [data-slot='tabs-trigger']")].find((el) =>
        /Hall|大廳|大厅/.test(el.textContent || "")
      )
      if (hall instanceof HTMLElement) hall.click()
    })
    await page.waitForSelector("[data-hall]", { timeout: 8000 })
  })

  const after = await evaluate(`({
    surface: document.documentElement.dataset.surface,
    locale: localStorage.getItem("kith-locale"),
    raw: Boolean(localStorage.getItem("kith-daybook-v3")),
    petTab: document.documentElement.dataset.petTab,
  })`)
  record("cdp", "locale persisted in localStorage", after.locale === "en", String(after.locale))
  record("cdp", "daybook snapshot still present after writes", after.raw)
  record("cdp", "surface dataset tracks Notes", after.surface === "notes", String(after.surface))

  await page.screenshot({ path: "/opt/cursor/artifacts/live_test_notes.png" })
  await browser.close()

  const failed = results.filter((item) => !item.ok)
  const passed = results.filter((item) => item.ok)
  const summary = {
    url: BASE,
    at: new Date().toISOString(),
    passed: passed.length,
    failed: failed.length,
    results,
  }
  writeFileSync("/tmp/kith-live-test.json", JSON.stringify(summary, null, 2))
  console.log(`\n${passed.length}/${results.length} passed`)
  if (failed.length) {
    console.log("Failures:")
    for (const item of failed) console.log(`  - [${item.suite}] ${item.name} ${item.detail}`)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
