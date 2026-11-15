"use client"

import { ChevronDown, Filter, Search } from "lucide-react"

const categoryOptions = [
  "All Categories",
  "Photography Studios",
  "Film & Cinema Studios",
  "Podcast Rooms",
  "Music Studios",
  "Art Workshops",
]

const priceOptions = ["Any Price", "$", "$$", "$$$", "$$$$"]

const locationOptions = [
  "Any Location",
  "Downtown",
  "Midtown",
  "Uptown",
  "Suburbs",
]

const selectClassName =
  "h-11 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pl-3.5 pr-9 text-sm text-slate-700 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"

export function ExploreStudios() {
  return (
    <section
      id="explore"
      className="relative overflow-hidden bg-[#0a0812]"
    >
      {/* Studio photo approximated with gradients, a softbox silhouette and
          neon tube light. Swap for a real image when one exists. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(55%_70%_at_58%_50%,rgba(147,51,234,0.40),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(35%_55%_at_88%_70%,rgba(59,130,246,0.18),transparent_70%)]" />

        {/* Octagonal softbox on a stand */}
        <div className="absolute top-[14%] right-[26%] size-44 lg:size-56">
          <div className="size-full bg-[#17131f] [clip-path:polygon(30%_0%,70%_0%,100%_30%,100%_70%,70%_100%,30%_100%,0%_70%,0%_30%)]" />
          <div className="absolute top-1/2 left-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300/70 shadow-[0_0_24px_rgba(255,255,255,0.35)] blur-[2px]" />
          <div className="absolute top-full left-1/2 h-24 w-px -translate-x-1/2 bg-white/15" />
        </div>

        {/* Blue neon tube light */}
        <div className="absolute top-[25%] right-[6%] bottom-[22%] w-1 rounded-full bg-gradient-to-b from-cyan-300 via-sky-400 to-blue-600 shadow-[0_0_18px_rgba(56,189,248,0.9)]" />
        <div className="absolute top-[35%] right-[13%] bottom-[30%] w-0.5 rounded-full bg-gradient-to-b from-violet-300 to-violet-600 shadow-[0_0_14px_rgba(167,139,250,0.7)]" />

        {/* Keep the text side dark and readable */}
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-[#0a0812] via-[#0a0812]/75 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 lg:pt-14 lg:pb-16">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="h-0.5 w-7 rounded-full bg-gradient-to-r from-violet-400 to-purple-400"
          />
          <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">
            Explore Studios
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl">
          <span className="block">Discover Creative Spaces</span>
          <span className="block">Near You</span>
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-slate-300 sm:text-base">
          Filter, search and find the ideal studio for your next project.
        </p>
      </div>

      {/* Filter bar */}
      <form
        onSubmit={(event) => event.preventDefault()}
        className="relative bg-white px-4 py-3 sm:px-6"
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2.5">
          <div className="relative w-full lg:w-auto lg:flex-1">
            <Search
              aria-hidden
              className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            />
            <label htmlFor="explore-search" className="sr-only">
              Search studios
            </label>
            <input
              id="explore-search"
              type="search"
              placeholder="Search studios..."
              className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          <div className="relative w-[calc(50%-0.3125rem)] sm:w-auto sm:flex-1 lg:w-44 lg:flex-none">
            <label htmlFor="explore-category" className="sr-only">
              Category
            </label>
            <select id="explore-category" className={selectClassName}>
              {categoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400"
            />
          </div>

          <div className="relative w-[calc(50%-0.3125rem)] sm:w-auto sm:flex-1 lg:w-44 lg:flex-none">
            <label htmlFor="explore-price" className="sr-only">
              Price
            </label>
            <select id="explore-price" className={selectClassName}>
              {priceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400"
            />
          </div>

          <div className="relative w-[calc(50%-0.3125rem)] sm:w-auto sm:flex-1 lg:w-44 lg:flex-none">
            <label htmlFor="explore-location" className="sr-only">
              Location
            </label>
            <select id="explore-location" className={selectClassName}>
              {locationOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400"
            />
          </div>

          <button
            type="submit"
            className="flex h-11 w-[calc(50%-0.3125rem)] items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-500 px-5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
          >
            <Filter aria-hidden className="size-4" />
            Filter
          </button>
        </div>
      </form>
    </section>
  )
}
