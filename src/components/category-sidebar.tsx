import Link from "next/link"
import { cn } from "cn"

import { firstParam, studioCategories, type SearchParams } from "@/lib/studios"

function categoryHref(value: string): string {
  if (!value) {
    return "/all-catagory"
  }
  return `/all-catagory?category=${encodeURIComponent(value)}`
}

export async function CategorySidebar({ searchParams }: { searchParams: SearchParams }) {
  const activeCategory = firstParam((await searchParams).category)

  return (
    <aside className="self-start rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <h2 className="text-base font-bold tracking-tight text-slate-900">Categories</h2>

      <ul className="mt-3 flex flex-col gap-1">
        {studioCategories.map((category) => {
          const active = category.value === activeCategory

          return (
            <li key={category.value || "all"}>
              <Link
                href={categoryHref(category.value)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-violet-50 font-semibold text-violet-700"
                    : "font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <category.icon aria-hidden className="size-4 shrink-0" />
                {category.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
