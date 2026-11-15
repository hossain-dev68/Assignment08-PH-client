import { Suspense } from "react"
import type { Metadata } from "next"

import { CategorySidebar } from "@/components/category-sidebar"
import { StudioResults } from "@/components/studio-results"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "All Categories | StudioSpace",
  description:
    "Browse every studio by category — photography, film, podcast, music and art spaces, all in one place.",
};

function SidebarSkeleton() {
  return (
    <div
      role="status"
      className="self-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <span className="sr-only">Loading categories…</span>
      <Skeleton className="h-5 w-24" />
      <div className="mt-4 flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full rounded-lg" />
        ))}
      </div>
    </div>
  )
}

function ResultsSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">Loading studios…</span>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
          >
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="mt-3 ml-1.5 h-4 w-2/3" />
            <Skeleton className="mt-2 ml-1.5 h-3 w-1/2" />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="size-8 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export default function AllCategoryPage(props: PageProps<"/all-catagory">) {
  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        <h1 className="sr-only">All Categories</h1>

        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Suspense fallback={<SidebarSkeleton />}>
            <CategorySidebar searchParams={props.searchParams} />
          </Suspense>

          <Suspense fallback={<ResultsSkeleton />}>
            <StudioResults searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
