export function ListYourStudio() {
  return (
    <section
      id="list-your-studio"
      className="bg-white px-4 pt-16 sm:px-6 lg:pt-24"
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#0f0c16]">
        {/* Neon-lit studio photo approximated with gradients, tube-light bars,
            and a dark silhouette. Swap for a real image when one exists. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(45%_75%_at_78%_45%,rgba(168,85,247,0.55),transparent_72%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(30%_55%_at_96%_62%,rgba(236,72,153,0.40),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(28%_50%_at_64%_28%,rgba(59,130,246,0.28),transparent_70%)]" />

          <div className="absolute top-[18%] bottom-[30%] left-[66%] w-0.5 rounded-full bg-gradient-to-b from-violet-200 via-fuchsia-400 to-violet-600 shadow-[0_0_16px_rgba(217,70,239,0.9)]" />
          <div className="absolute top-[8%] bottom-[45%] left-[75%] w-0.5 rounded-full bg-gradient-to-b from-fuchsia-200 via-fuchsia-400 to-violet-500 shadow-[0_0_16px_rgba(232,121,249,0.9)]" />
          <div className="absolute top-[25%] bottom-[18%] left-[85%] w-0.5 rounded-full bg-gradient-to-b from-violet-200 via-purple-400 to-violet-700 shadow-[0_0_16px_rgba(192,132,252,0.85)]" />
          <div className="absolute top-[12%] bottom-[38%] left-[93%] w-0.5 rounded-full bg-gradient-to-b from-blue-200 via-sky-400 to-indigo-500 shadow-[0_0_14px_rgba(56,189,248,0.8)]" />

          {/* Foreground silhouette (person / equipment) */}
          <div className="absolute right-[6%] bottom-0 h-28 w-24 rounded-t-[50%] bg-black/60 blur-lg lg:h-40 lg:w-32" />

          {/* Keep the text side dark and readable */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#0f0c16] via-[#0f0c16]/80 to-transparent" />
        </div>

        <div className="relative px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
          <h2 className="text-3xl font-extrabold tracking-tight text-white lg:text-4xl">
            Ready to List Your Studio?
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-300 lg:text-lg">
            Share your creative space with a global community of creators and
            start earning today.
          </p>
        </div>
      </div>
    </section>
  )
}
