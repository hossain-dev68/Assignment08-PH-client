import { Camera, Film, LayoutGrid, Mic, Music, Palette, type LucideIcon } from "lucide-react"

/** Search params are a promise in Next 16 — shared by page-level components. */
export type SearchParams = Promise<Record<string, string | string[] | undefined>>

/** Shape of a studio document returned by `GET /destination`. */
export type Studio = {
  _id: string
  name: string
  category?: string
  description?: string
  location?: string
  price?: string | number
  capacity?: string | number
  images?: string[]
  /** Optional — only present if the backend starts storing ratings. */
  rating?: number | string
  reviews?: number
}

export type StudioCategory = {
  /** Short label shown in the sidebar. */
  label: string
  /** Exact `category` value stored by the create-studio form. */
  value: string
  icon: LucideIcon
}

/** Sidebar entries — `value` must match what create-studio posts. */
export const studioCategories: StudioCategory[] = [
  { label: "All Categories", value: "", icon: LayoutGrid },
  { label: "Photography", value: "Photography Studios", icon: Camera },
  { label: "Film & Cinema", value: "Film & Cinema Studios", icon: Film },
  { label: "Podcast", value: "Podcast Rooms", icon: Mic },
  { label: "Music", value: "Music Studios", icon: Music },
  { label: "Art Workshops", value: "Art Workshops", icon: Palette },
]

export const DESTINATION_URL = "http://localhost:8000/destination"
export const STUDIOS_PER_PAGE = 6

/** Reads the first value of a (possibly repeated) search param. */
export function firstParam(value: string | string[] | undefined): string {
  const first = Array.isArray(value) ? value[0] : value
  return (first ?? "").trim()
}

/** "Uttara ,Dhaka" → "Uttara, Dhaka" (the DB stores inconsistent spacing). */
export function formatLocation(location?: string): string {
  return (location ?? "").replace(/\s*,\s*/g, ", ").trim()
}

/** 2300 → "৳2,300/hr"; returns null when no price was stored. */
export function formatPrice(price?: string | number): string | null {
  if (price === undefined || price === null || String(price).trim() === "") {
    return null
  }
  const value = Number(price)
  if (!Number.isFinite(value)) {
    return `৳${String(price).trim()}/hr`
  }
  return `৳${value.toLocaleString("en-US")}/hr`
}

/** 6 → "6 guests", 1 → "1 guest"; null when capacity is missing. */
export function formatCapacity(capacity?: string | number): string | null {
  if (capacity === undefined || capacity === null || String(capacity).trim() === "") {
    return null
  }
  const value = Number(capacity)
  if (!Number.isFinite(value)) {
    return `${String(capacity).trim()} guests`
  }
  return `${value.toLocaleString("en-US")} ${value === 1 ? "guest" : "guests"}`
}
