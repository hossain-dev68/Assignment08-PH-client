import Booking from "@/components/booking/Booking"


export default function BookingPage() {
  const studio = {
    _id: "studio-1",
    name: "Creative Lens Studio",
    category: "Photography Studios",
    location: "Uttara, Dhaka",
    price: 2500,
    capacity: 6,
    rating: 4.8,
    reviews: 14,
    images: [],
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <h2 className="sr-only">Studio Booking</h2>
        <Booking studio={studio} />
      </div>
    </main>
  )
}
