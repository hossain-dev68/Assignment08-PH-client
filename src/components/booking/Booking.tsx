"use client"

import * as React from "react"
import { Heart, LayoutGrid, MapPin, Star, Users } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import {
    formatCapacity,
    formatLocation,
    formatPrice,
    studioCategories,
    type Studio,
} from "@/lib/studios"
import { authClient } from "@/lib/auth-client"
import { Input } from "../ui/input"

type BookingProps = {
    studio: Studio
}


const Booking = ({ studio }: BookingProps) => {

    const { data: session } = authClient.useSession()

    const user = session?.user;

    const [isBooking, setIsBooking] = React.useState(false)
    const [bookingError, setBookingError] = React.useState<string | null>(null)

    const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!user) {
            setBookingError("Please sign in to book a studio.")
            return
        }

        const form = e.currentTarget
        const departureDateInput = form.elements.namedItem(
            "departureDate",
        ) as HTMLInputElement | null
        const departureDate = departureDateInput?.value

        if (!departureDate) {
            setBookingError("Please select a departure date.")
            return
        }

        setIsBooking(true)
        setBookingError(null)

        const data = {
            username: user.name ?? "",
            email: user.email ?? "",
            image: user.image ?? "",
            ...studio,
            departureDate,
            bookingDate: new Date(),
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                throw new Error(`Booking failed: ${res.status}`)
            }

            const bookingData = await res.json()
            console.log(bookingData)

            form.reset()
            scrollToAvailability()
        } catch (err) {
            setBookingError(
                err instanceof Error ? err.message : "Something went wrong.",
            )
        } finally {
            setIsBooking(false)
        }
    }




    const [favorite, setFavorite] = React.useState(false)

    const name = studio.name?.trim() || "Untitled studio"
    const formattedPrice = formatPrice(studio.price)
    const priceAmount = formattedPrice?.replace(/\/hr$/, "")
    const location = formatLocation(studio.location)
    const capacityText = formatCapacity(studio.capacity)
    const category = studio.category?.trim() || null
    const CategoryIcon =
        studioCategories.find((entry) => entry.value === category)?.icon ??
        LayoutGrid

    const numericRating = Number(studio.rating)
    const hasRating =
        studio.rating !== undefined &&
        studio.rating !== null &&
        String(studio.rating).trim() !== "" &&
        Number.isFinite(numericRating)
    const reviewCount = studio.reviews

    const scrollToAvailability = () => {
        document
            .getElementById("availability")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {name}
                </h1>

                {hasRating && (
                    <p className="flex items-center gap-1.5 text-sm">
                        <Star
                            aria-hidden
                            className="size-4 fill-amber-400 text-amber-400"
                        />
                        <span className="font-semibold text-slate-900">
                            {studio.rating}
                        </span>
                        {reviewCount !== undefined && reviewCount !== null && (
                            <span className="text-slate-500">
                                ({reviewCount} review{reviewCount === 1 ? "" : "s"})
                            </span>
                        )}
                    </p>
                )}
            </div>

            {formattedPrice && (
                <p className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tracking-tight text-violet-600">
                        {priceAmount}
                    </span>
                    <span className="text-sm font-medium text-slate-500">/ hour</span>
                </p>
            )}

            {location && (
                <p className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin aria-hidden className="size-4 shrink-0 text-slate-400" />
                    {location}
                </p>
            )}

            {(capacityText || category) && (
                <ul className="flex flex-col gap-2.5">
                    {capacityText && (
                        <li className="flex items-center gap-2.5 text-sm text-slate-600">
                            <Users aria-hidden className="size-4 shrink-0 text-slate-400" />
                            Max {capacityText}
                        </li>
                    )}
                    {category && (
                        <li className="flex items-center gap-2.5 text-sm text-slate-600">
                            <CategoryIcon
                                aria-hidden
                                className="size-4 shrink-0 text-slate-400"
                            />
                            {category}
                        </li>
                    )}
                </ul>
            )}

            <div className="flex items-center gap-2.5">
                <form onSubmit={handleBooking}>
                    <Input
                        type="date"
                        name="departureDate"
                        aria-label="Departure date"
                        className="mt-4"
                        required
                    ></Input>
                    {bookingError && (
                        <p className="mt-2 text-sm text-red-600">
                            {bookingError}
                        </p>
                    )}
                    <Button
                        type="submit"
                        disabled={isBooking || !user}
                        className="h-11 flex-1 rounded-xl bg-violet-600 px-6 font-semibold text-white shadow-md shadow-violet-600/30 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isBooking ? "Booking..." : "Book Now"}
                    </Button>
                </form>
                <Button
                    type="button"
                    variant="outline"
                    aria-label={
                        favorite
                            ? `Remove ${name} from favorites`
                            : `Add ${name} to favorites`
                    }
                    aria-pressed={favorite}
                    onClick={() => setFavorite((current) => !current)}
                    className="h-11 w-11 rounded-xl border-slate-200 bg-white px-0 hover:bg-slate-50"
                >
                    <Heart
                        aria-hidden
                        className={cn(
                            "size-5",
                            favorite ? "fill-red-500 text-red-500" : "text-slate-600"
                        )}
                    />
                </Button>
            </div>
        </div>
    )
}

export default Booking
