const steps = [
  {
    title: "Search & Explore",
    description: "Find the perfect studio for your project.",
  },
  {
    title: "Check Availability",
    description: "View real-time availability and pricing.",
  },
  {
    title: "Book & Create",
    description: "Reserve your space and bring your ideas to life.",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-white px-4 pt-10 pb-20 sm:px-6 lg:pt-14 lg:pb-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="h-0.5 w-7 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
          />
          <span className="text-xs font-bold tracking-widest text-violet-600 uppercase">
            How It Works
          </span>
        </div>

        <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl">
          Book in 3 Simple Steps
        </h2>

        <ol className="mt-10 grid gap-8 md:grid-cols-3 lg:mt-12 lg:gap-10">
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
              </div>
              <p className="max-w-64 text-base leading-relaxed text-slate-500">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
