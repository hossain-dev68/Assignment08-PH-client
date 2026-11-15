"use client"

import {
  Camera,
  ChevronDown,
  Mic,
  MoreHorizontal,
  Music,
  Palette,
  Search,
  Video,
} from "lucide-react"

const categories = [
  { icon: Camera, label: "Photography Studios" },
  { icon: Video, label: "Film & Cinema Studios" },
  { icon: Mic, label: "Podcast Rooms" },
  { icon: Music, label: "Music Studios" },
  { icon: Palette, label: "Art Workshops" },
  { icon: MoreHorizontal, label: "& More" },
]

const categoryOptions = [
  "All Categories",
  "Photography Studios",
  "Film & Cinema Studios",
  "Podcast Rooms",
  "Music Studios",
  "Art Workshops",
]

export function Banner() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a12]">
      {/* Studio-photo backdrop approximated with gradients. When a real photo
          exists (e.g. public/studio-hero.jpg), replace these layers with it. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(65%_55%_at_72%_30%,rgba(196,132,252,0.30),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_45%_at_92%_70%,rgba(244,114,182,0.22),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_50%_at_10%_20%,rgba(124,58,237,0.28),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/25 to-black/85" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:pb-24 lg:pt-24">
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
          <span className="block">Find. Book. Create.</span>
          <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Your Perfect
          </span>
          <span className="block">Creative Space.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 lg:text-lg">
          Discover and book professional studios for filmmakers, photographers,
          podcasters, musicians and creators — all in one place.
        </p>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="mt-10 flex max-w-2xl items-center gap-2 rounded-full bg-white p-2 pl-4 shadow-2xl shadow-black/40 sm:gap-3 sm:pl-5"
        >
          <Search aria-hidden className="size-4 shrink-0 text-slate-400" />
          <label htmlFor="studio-search" className="sr-only">
            Search for studios
          </label>
          <input
            id="studio-search"
            type="search"
            placeholder="Search for studios..."
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
          <div aria-hidden className="hidden h-6 w-px bg-slate-200 sm:block" />
          <div className="relative hidden shrink-0 items-center sm:flex">
            <label htmlFor="studio-category" className="sr-only">
              Category
            </label>
            <select
              id="studio-category"
              className="cursor-pointer appearance-none rounded-full bg-transparent py-2 pl-3 pr-8 text-sm text-slate-700 outline-none"
            >
              {categoryOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-2 size-4 text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:px-7"
          >
            Search
          </button>
        </form>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:mt-14 lg:grid-cols-6 lg:gap-4">
          {categories.map(({ icon: Icon, label }) => (
            <li key={label}>
              <a
                href="#explore"
                className="group flex min-h-28 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-5 text-center backdrop-blur-sm transition-colors hover:border-violet-400/40 hover:bg-white/[0.1]"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-violet-500/30">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span className="text-sm font-medium leading-snug text-white">
                  {label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
