"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, Image as ImageIcon, MapPin, Star, Users } from "lucide-react"
import { cn } from "cn"

import { formatCapacity, formatLocation, formatPrice } from "@/lib/studios"

type StudioCardProps = {
  name: string
  /** When set, the whole card links here (detail page). */
  href?: string
  image?: string
  price?: string | number
  location?: string
  capacity?: string | number
  rating?: number | string
  reviews?: number
}

export function StudioCard({
  name,
  href,
  image,
  price,
  location,
  capacity,
  rating,
  reviews,
}: StudioCardProps) {
  const [favorite, setFavorite] = React.useState(false)

  const formattedPrice = formatPrice(price)
  const formattedLocation = formatLocation(location)
  const capacityText = formatCapacity(capacity)
  const hasRating = rating !== undefined && rating !== null && String(rating).trim() !== ""

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative overflow-hidden rounded-xl bg-slate-100">
        <div className="aspect-[4/3] w-full">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- data:/blob: previews don't fit next/image
            <img
              src={image}
              alt={name}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-1.5 text-slate-400">
              <ImageIcon aria-hidden className="size-7" />
              <span className="text-xs font-medium">No photo yet</span>
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label={favorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
          aria-pressed={favorite}
          onClick={() => setFavorite((current) => !current)}
          className="absolute top-2 right-2 z-20 flex size-7 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:bg-white active:scale-90"
        >
          <Heart
            aria-hidden
            className={cn(
              "size-4 transition-colors",
              favorite ? "fill-red-500 text-red-500" : "text-slate-700"
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-1.5 pt-3 pb-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 truncate text-sm font-bold text-slate-900" title={name}>
            {name}
          </h3>
          {formattedPrice && (
            <span className="shrink-0 text-sm font-bold text-violet-600">
              {formattedPrice}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
          {hasRating ? (
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <Star aria-hidden className="size-3.5 fill-amber-400 text-amber-400" />
              {rating}
              {reviews !== undefined && reviews !== null && (
                <span className="font-normal text-slate-400">({reviews})</span>
              )}
            </span>
          ) : (
            capacityText && (
              <span className="flex items-center gap-1">
                <Users aria-hidden className="size-3.5 text-slate-400" />
                {capacityText}
              </span>
            )
          )}

          {formattedLocation && (
            <span className="flex items-center gap-1">
              <MapPin aria-hidden className="size-3.5 text-slate-400" />
              {formattedLocation}
            </span>
          )}
        </div>
      </div>

      {href && (
        // Stretched link: covers the card so the whole thing is clickable while
        // the heart button (z-20) stays above it — no <button> inside <a>.
        <Link
          href={href}
          aria-label={`View ${name}`}
          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
        />
      )}
    </article>
  )
}
