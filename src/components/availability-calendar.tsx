"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "cn"

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

type SelectedDate = {
  year: number
  month: number
  day: number
}

type AvailabilityCalendarProps = {
  /** Seeds the "filling fast" pattern so studios show different dates. */
  studioId?: string
}

function toStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function seedFrom(studioId: string): number {
  let seed = 0
  for (const char of studioId) {
    seed = (seed * 31 + char.charCodeAt(0)) % 1000
  }
  return seed
}

export function AvailabilityCalendar({
  studioId = "",
}: AvailabilityCalendarProps) {
  const today = toStartOfDay(new Date())
  const [cursor, setCursor] = React.useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selected, setSelected] = React.useState<SelectedDate | null>(null)

  const seed = seedFrom(studioId)

  const monthLabel = new Date(
    cursor.year,
    cursor.month,
    1
  ).toLocaleString("en-US", { month: "long", year: "numeric" })

  const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay()
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate()

  const isCurrentMonth =
    cursor.year === today.getFullYear() && cursor.month === today.getMonth()

  const showPreviousMonth = () => {
    setCursor(({ year, month }) => {
      const previous = new Date(year, month - 1, 1)
      return { year: previous.getFullYear(), month: previous.getMonth() }
    })
  }

  const showNextMonth = () => {
    setCursor(({ year, month }) => {
      const next = new Date(year, month + 1, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  return (
    <section
      id="availability"
      aria-labelledby="availability-heading"
      className="min-w-0 scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
    >
      <h2
        id="availability-heading"
        className="text-base font-semibold text-slate-900 sm:text-lg"
      >
        Availability
      </h2>

      <div className="mt-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={showPreviousMonth}
          disabled={isCurrentMonth}
          aria-label="Previous month"
          className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:text-slate-300"
        >
          <ChevronLeft aria-hidden className="size-4" />
        </button>

        <p className="text-sm font-semibold text-slate-900">{monthLabel}</p>

        <button
          type="button"
          onClick={showNextMonth}
          aria-label="Next month"
          className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          <ChevronRight aria-hidden className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid w-fit grid-cols-7 gap-1">
        {WEEKDAYS.map((weekday) => (
          <span
            key={weekday}
            aria-hidden
            className="flex size-8 items-center justify-center text-xs font-medium text-slate-400 sm:size-9 md:size-10"
          >
            {weekday}
          </span>
        ))}

        {Array.from({ length: firstWeekday }, (_, index) => (
          <span
            key={`pad-${index}`}
            aria-hidden
            className="size-8 sm:size-9 md:size-10"
          />
        ))}

        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const date = new Date(cursor.year, cursor.month, day)
          const isPast = date < today
          const isSelected =
            selected !== null &&
            selected.year === cursor.year &&
            selected.month === cursor.month &&
            selected.day === day
          const isPopular =
            !isPast && !isSelected && (day + cursor.month * 3 + seed) % 5 === 0

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              aria-pressed={isSelected}
              aria-label={`${monthLabel} ${day}${isPast ? ", unavailable" : ""}`}
              onClick={() =>
                setSelected({ year: cursor.year, month: cursor.month, day })
              }
              className={cn(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium transition sm:size-9 md:size-10",
                isPast
                  ? "cursor-not-allowed text-slate-300"
                  : isSelected
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-600/40"
                    : isPopular
                      ? "bg-violet-100 text-violet-700 hover:bg-violet-200"
                      : "text-slate-700 hover:bg-violet-50 hover:text-violet-700"
              )}
            >
              {day}
            </button>
          )
        })}
      </div>
    </section>
  )
}
