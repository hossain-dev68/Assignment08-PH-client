import type { Metadata } from "next"
import Link from "next/link"
import { Suspense, cache } from "react"
import { SearchX, TriangleAlert } from "lucide-react"
import { headers } from "next/headers"

import { StudioDetailView } from "@/components/studio-detail-view"
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { DESTINATION_URL, type Studio } from "@/lib/studios"

type StudioLoadResult =
  | { status: "ok"; studio: Studio }
  | { status: "not-found" }
  | { status: "unavailable" }

/** One fetch per request, shared by `generateMetadata` and the page. */
const loadStudio = cache(async (id: string): Promise<StudioLoadResult> => {
  try {
     const res = await fetch(`${DESTINATION_URL}/${id}`,
    // {
    //   headers: {
    //     authorization: 'user logged in'
    //   }
    // }
    );
    if (!res.ok) {
      // The API answers non-2xx for ids it cannot find, so treat it as missing.
      return { status: "not-found" }
    }

    const payload: unknown = await res.json()
    // `GET /destination/:id` wraps the document as `{ result: … }`.
    const data: unknown =
      payload && typeof payload === "object" && "result" in payload
        ? (payload as { result: unknown }).result
        : payload

    if (
      !data ||
      typeof data !== "object" ||
      !("_id" in data || "name" in data)
    ) {
      return { status: "not-found" }
    }

    return { status: "ok", studio: data as Studio }
  } catch (error) {
    console.error("Could not load studio:", error)
    return { status: "unavailable" }
  }
})

export async function generateMetadata(
  props: PageProps<"/all-catagory/[id]">
): Promise<Metadata> {
  const { id } = await props.params
  const result = await loadStudio(id)

  if (result.status === "not-found") {
    return { title: "Studio not found | StudioSpace" }
  }
  if (result.status === "unavailable") {
    return { title: "Studio | StudioSpace" }
  }

  const { studio } = result
  const name = studio.name?.trim() || "Studio"

  return {
    title: `${name} | StudioSpace`,
    description:
      studio.description?.trim() ||
      `Book ${name} by the hour on StudioSpace.`,
  }
}

/** Mirrors the detail layout so the shell never flashes an empty screen. */
function DetailsSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-6 lg:gap-8">
      <span className="sr-only">Loading studio details&hellip;</span>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-3">
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="aspect-[16/9] w-16 shrink-0 rounded-lg"
              />
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/5" />
          <div className="flex gap-2.5 pt-1">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:gap-8">
        <div className="flex min-w-0 flex-col gap-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  )
}

async function StudioDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await loadStudio(id)

  if (result.status === "ok") {
    return <StudioDetailView studio={result.studio} />
  }

  if (result.status === "not-found") {
    return (
      <Empty className="rounded-2xl border border-slate-200 bg-white py-16">
        <EmptyMedia variant="icon">
          <SearchX aria-hidden />
        </EmptyMedia>
        <EmptyTitle className="text-base font-semibold text-slate-900">
          Studio not found
        </EmptyTitle>
        <EmptyDescription>
          This studio doesn&rsquo;t exist any more, or the link is incorrect.{" "}
          <Link
            href="/all-catagory"
            className="font-semibold text-violet-600 hover:text-violet-700"
          >
            Browse all studios
          </Link>
          .
        </EmptyDescription>
      </Empty>
    )
  }

  return (
    <Empty className="rounded-2xl border border-slate-200 bg-white py-16">
      <EmptyMedia variant="icon">
        <TriangleAlert aria-hidden />
      </EmptyMedia>
      <EmptyTitle className="text-base font-semibold text-slate-900">
        Couldn&rsquo;t load this studio
      </EmptyTitle>
      <EmptyDescription>
        The studio server on localhost:8000 didn&rsquo;t respond. Start the
        backend and refresh the page.
      </EmptyDescription>
    </Empty>
  )
}

export default function CatagoryDetailsPage(
  props: PageProps<"/all-catagory/[id]">
) {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <Suspense fallback={<DetailsSkeleton />}>
          <StudioDetails params={props.params} />
        </Suspense>
      </div>
    </main>
  )
}
