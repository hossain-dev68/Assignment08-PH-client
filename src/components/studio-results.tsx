import Link from "next/link"
import { ChevronLeft, ChevronRight, Images, TriangleAlert } from "lucide-react"
import { cn } from "cn"

import { StudioCard } from "@/components/studio-card"
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  DESTINATION_URL,
  STUDIOS_PER_PAGE,
  firstParam,
  studioCategories,
  type SearchParams,
  type Studio,
} from "@/lib/studios"

async function loadStudios(): Promise<{ studios: Studio[]; failed: boolean }> {
  try {
    const res = await fetch(DESTINATION_URL)
    if (!res.ok) {
      throw new Error(`Unexpected status ${res.status}`)
    }
    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      throw new Error("Response was not a list of studios")
    }
    return { studios: data as Studio[], failed: false }
  } catch (error) {
    console.error("Could not load studios:", error)
    return { studios: [], failed: true }
  }
}

/** Keeps the active category while switching pages. */
function buildHref(category: string, page: number): string {
  const params = new URLSearchParams()
  if (category) {
    params.set("category", category)
  }
  if (page > 1) {
    params.set("page", String(page))
  }
  const query = params.toString()
  return query ? `/all-catagory?${query}` : "/all-catagory"
}

/** 1, 2, 3, … , 9, 10, 11 — first/last page always shown, ellipsis in between. */
function pageList(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages = [...new Set([1, total, current - 1, current, current + 1])]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)

  const items: Array<number | "ellipsis"> = []
  let previous = 0
  for (const page of pages) {
    if (page - previous > 1) {
      items.push("ellipsis")
    }
    items.push(page)
    previous = page
  }
  return items
}

function Pagination({ category, current, total }: { category: string; current: number; total: number }) {
  const items = pageList(current, total)

  return (
    <nav aria-label="Pagination" className="flex justify-center pt-1">
      <ul className="flex items-center gap-1">
        <li>
          {current > 1 ? (
            <Link
              href={buildHref(category, current - 1)}
              rel="prev"
              aria-label="Previous page"
              className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </Link>
          ) : (
            <span
              aria-hidden
              className="flex size-8 items-center justify-center rounded-lg text-slate-300"
            >
              <ChevronLeft className="size-4" />
            </span>
          )}
        </li>

        {items.map((item, index) =>
          item === "ellipsis" ? (
            <li
              key={`ellipsis-${index}`}
              aria-hidden
              className="flex size-8 items-center justify-center text-sm text-slate-400"
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={buildHref(category, item)}
                aria-current={item === current ? "page" : undefined}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-sm transition",
                  item === current
                    ? "bg-violet-600 font-semibold text-white shadow-sm shadow-violet-500/30"
                    : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {item}
              </Link>
            </li>
          )
        )}

        <li>
          {current < total ? (
            <Link
              href={buildHref(category, current + 1)}
              rel="next"
              aria-label="Next page"
              className="flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <ChevronRight aria-hidden className="size-4" />
            </Link>
          ) : (
            <span
              aria-hidden
              className="flex size-8 items-center justify-center rounded-lg text-slate-300"
            >
              <ChevronRight className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  )
}

export async function StudioResults({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams
  const category = firstParam(query.category)
  const requestedPage = Number.parseInt(firstParam(query.page), 10)
  const requestedPageNumber = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1

  const { studios, failed } = await loadStudios()

  const filtered = category
    ? studios.filter((studio) => (studio.category ?? "").trim() === category)
    : studios

  const totalPages = Math.max(1, Math.ceil(filtered.length / STUDIOS_PER_PAGE))
  const currentPage = Math.min(requestedPageNumber, totalPages)
  const pageStudios = filtered.slice(
    (currentPage - 1) * STUDIOS_PER_PAGE,
    currentPage * STUDIOS_PER_PAGE
  )

  const categoryLabel =
    studioCategories.find((entry) => entry.value === category)?.label ?? category

  return (
    <div className="flex flex-col gap-6">
      {failed ? (
        <Empty className="border border-slate-200 bg-white py-16">
          <EmptyMedia variant="icon">
            <TriangleAlert aria-hidden />
          </EmptyMedia>
          <EmptyTitle className="text-base font-semibold text-slate-900">
            Couldn&rsquo;t load studios
          </EmptyTitle>
          <EmptyDescription>
            The studio server on localhost:8000 didn&rsquo;t respond. Start the
            backend and refresh the page.
          </EmptyDescription>
        </Empty>
      ) : filtered.length === 0 ? (
        <Empty className="border border-slate-200 bg-white py-16">
          <EmptyMedia variant="icon">
            <Images aria-hidden />
          </EmptyMedia>
          <EmptyTitle className="text-base font-semibold text-slate-900">
            No studios found
          </EmptyTitle>
          <EmptyDescription>
            {category
              ? `Nothing listed under “${categoryLabel}” yet — try another category, or `
              : "No studios have been listed yet. "}
            <Link
              href="/create-studio"
              className="font-semibold text-violet-600 hover:text-violet-700"
            >
              list your studio
            </Link>
            .
          </EmptyDescription>
        </Empty>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageStudios.map((studio) => (
            <li key={studio._id}>
              <StudioCard
                name={studio.name || "Untitled studio"}
                href={studio._id ? `/all-catagory/${studio._id}` : undefined}
                image={studio.images?.[0]}
                price={studio.price}
                location={studio.location}
                capacity={studio.capacity}
                rating={studio.rating}
                reviews={studio.reviews}
              />
            </li>
          ))}
        </ul>
      )}

      {!failed && totalPages > 1 && (
        <Pagination category={category} current={currentPage} total={totalPages} />
      )}
    </div>
  )
}
