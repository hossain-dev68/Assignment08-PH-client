"use client"

import * as React from "react"
import { Check, Image as ImageIcon, Star } from "lucide-react"
import { cn } from "cn"

import { AvailabilityCalendar } from "@/components/availability-calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  formatCapacity,
  formatLocation,
  formatPrice,
  type Studio,
} from "@/lib/studios"
import Booking from "./booking/Booking"

type StudioDetailViewProps = {
  studio: Studio
}

/** Active underline sits on the list's bottom border, like the reference design. */
const tabTriggerClassName =
  "flex-none rounded-none px-0 py-3 text-sm font-semibold text-slate-500 after:bg-violet-600 group-data-horizontal/tabs:after:-bottom-px data-active:text-slate-900"

export function StudioDetailView({ studio }: StudioDetailViewProps) {
  const images = (studio.images ?? []).filter(
    (src) => typeof src === "string" && src.trim() !== ""
  )
  const [activeIndex, setActiveIndex] = React.useState(0)

  const safeIndex = activeIndex < images.length ? activeIndex : 0
  const activeImage = images[safeIndex]

  const name = studio.name?.trim() || "Untitled studio"
  const formattedPrice = formatPrice(studio.price)
  const location = formatLocation(studio.location)
  const capacityText = formatCapacity(studio.capacity)
  const category = studio.category?.trim() || null

  const numericRating = Number(studio.rating)
  const hasRating =
    studio.rating !== undefined &&
    studio.rating !== null &&
    String(studio.rating).trim() !== "" &&
    Number.isFinite(numericRating)
  const reviewCount = studio.reviews

  const highlights: string[] = []
  if (capacityText) highlights.push(`Flexible layout for up to ${capacityText}`)
  if (location) highlights.push(`Great location in ${location}`)
  if (formattedPrice) highlights.push(`Priced at ${formattedPrice}`)

  const amenities: string[] = []
  if (category) amenities.push(category)
  if (capacityText) amenities.push(`Up to ${capacityText}`)
  if (location) amenities.push(`Located in ${location}`)
  if (formattedPrice) amenities.push("Book by the hour")

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-8">
      {/* Gallery */}
      <div className="flex min-w-0 flex-col gap-3">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <div className="aspect-[16/9] w-full">
            {activeImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- data:/blob: previews don't fit next/image
              <img
                src={activeImage}
                alt={name}
                decoding="async"
                className="size-full object-cover"
              />
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1.5 text-slate-400">
                <ImageIcon aria-hidden className="size-8" />
                <span className="text-sm font-medium">No photo yet</span>
              </div>
            )}
          </div>
        </div>

        {images.length > 1 && (
          <ul className="flex gap-2 overflow-x-auto pb-1">
            {images.map((src, index) => (
              <li key={index} className="shrink-0">
                <button
                  type="button"
                  aria-label={`Show photo ${index + 1} of ${images.length}`}
                  aria-pressed={index === safeIndex}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "block aspect-[16/9] w-16 overflow-hidden rounded-lg border-2 transition",
                    index === safeIndex
                      ? "border-violet-600"
                      : "border-slate-200 opacity-80 hover:opacity-100"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- data:/blob: previews don't fit next/image */}
                  <img
                    src={src}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    className="size-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Summary */}
      <Booking studio={studio} />

      {/* Tabs */}
      <div className="min-w-0">
        <Tabs defaultValue="overview" className="gap-0">
          <TabsList
            variant="line"
            className="group-data-horizontal/tabs:h-auto w-full justify-start gap-6 border-b border-slate-200 p-0"
          >
            <TabsTrigger value="overview" className={tabTriggerClassName}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="amenities" className={tabTriggerClassName}>
              Amenities
            </TabsTrigger>
            <TabsTrigger value="reviews" className={tabTriggerClassName}>
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="overview"
            className="flex flex-col gap-4 pt-5 text-sm leading-relaxed text-slate-600"
          >
            <p>
              {studio.description?.trim() ||
                "No description has been added for this studio yet."}
            </p>

            {highlights.length > 0 && (
              <ul className="flex flex-col gap-2.5">
                {highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5">
                    <Check
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-emerald-500"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="amenities" className="pt-5">
            {amenities.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-full border border-violet-100 bg-violet-50 px-3.5 py-1.5 text-sm font-medium text-violet-700"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                No amenities have been listed for this studio yet.
              </p>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="pt-5">
            {hasRating ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                    {studio.rating}
                  </span>
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={cn(
                            "size-4",
                            index < Math.round(numericRating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200"
                          )}
                        />
                      ))}
                    </div>
                    {reviewCount !== undefined && reviewCount !== null && (
                      <span className="text-sm text-slate-500">
                        {reviewCount} review{reviewCount === 1 ? "" : "s"}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Individual reviews are coming soon — book the studio and share
                  your experience afterwards.
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 text-sm text-slate-500">
                <Star
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-slate-300"
                />
                <p>
                  No reviews yet — book this studio and be the first to share
                  your experience.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Availability */}
      <AvailabilityCalendar studioId={studio._id ?? ""} />
    </div>
  )
}
