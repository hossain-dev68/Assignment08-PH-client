import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { Calendar, MapPin, Users } from "lucide-react"
import { formatCapacity, formatLocation, formatPrice } from "@/lib/studios"

type Booking = {
  _id?: string
  name?: string
  category?: string
  location?: string
  price?: string | number
  capacity?: string | number
  images?: string[]
  departureDate?: string
  bookingDate?: string
  username?: string
  email?: string
}

async function getBookings(): Promise<Booking[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const user = session?.user

  if (!user?.email) {
    return []
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/my-booking/${user.email}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    return []
  }

  return (await res.json()) as Booking[]
}

function formatDate(value: string | undefined): string {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function BookingCard({ booking }: { booking: Booking }) {
  const name = booking.name?.trim() || "Untitled studio"
  const formattedPrice = formatPrice(booking.price)
  const formattedLocation = formatLocation(booking.location)
  const capacityText = formatCapacity(booking.capacity)

  return (
    <article className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-2 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative overflow-hidden rounded-xl bg-slate-100">
        <div className="aspect-[4/3] w-full">
          {booking.images?.[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={booking.images[0]}
              alt={name}
              loading="lazy"
              decoding="async"
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-1.5 text-slate-400">
              <Calendar aria-hidden className="size-7" />
              <span className="text-xs font-medium">No photo yet</span>
            </div>
          )}
        </div>
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
          {capacityText && (
            <span className="flex items-center gap-1">
              <Users aria-hidden className="size-3.5 text-slate-400" />
              {capacityText}
            </span>
          )}
          {formattedLocation && (
            <span className="flex items-center gap-1">
              <MapPin aria-hidden className="size-3.5 text-slate-400" />
              {formattedLocation}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
          <Calendar aria-hidden className="size-4 shrink-0 text-slate-400" />
          <span>Departure: {formatDate(booking.departureDate)}</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
          <Calendar aria-hidden className="size-4 shrink-0 text-slate-400" />
          <span>Booked: {formatDate(booking.bookingDate)}</span>
        </div>
      </div>
    </article>
  )
}

export default async function MyBookingPage() {
  const bookings = await getBookings()

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Bookings
        </h1>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
            <p className="text-slate-600">
              You do not have any bookings yet. Book a studio to see it here.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookings.map((booking) => (
              <BookingCard key={booking._id ?? booking.name} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
