"use client"

import Link from "next/link"
import { X, Mail, Phone, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "All Categories", href: "/all-catagory" },
  { label: "Create Studio", href: "/create-studio" },
  { label: "My Booking", href: "/mybooking" },
  { label: "Contact", href: "/contact" },
]

const categories = [
  "Photography",
  "Videography",
  "Podcasting",
  "Music Recording",
  "Dance",
  "Rehearsal",
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/90 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Logo + Mission statement */}
          <div className="lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="flex shrink-0 items-center gap-2.5 mb-6">
              <span
                className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-lg font-black text-white shadow-lg shadow-violet-500/30"
              >
                S
              </span>
              <span className="text-xl font-bold text-white">StudioSpace</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              StudioSpace connects creators with professional spaces — film,
              photo, music, and beyond. Book by the hour, create without limits.
            </p>
          </div>

          {/* Quick navigation links */}
          <div className="mb-8 lg:mb-0">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h2>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular studio categories */}
          <div className="mb-8 lg:mb-0">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Popular Categories
            </h2>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/all-catagory?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter input + Social links */}
          <div className="lg:col-span-1">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Newsletter
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Subscribe for studio updates, new spaces, and creator tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xs">
              <Input
                type="email"
                placeholder="you@email.com"
                className="flex-1 bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-violet-500"
              />
              <Button
                type="button"
                className="bg-gradient-to-r from-violet-600 to-purple-500 hover:opacity-90"
              >
                Subscribe
              </Button>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white transition-colors hover:bg-violet-500/20 hover:text-violet-300"
                aria-label="X"
              >
                <X className="size-5" />
              </a>
              <a
                href="mailto:hello@studiospace.com"
                className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white transition-colors hover:bg-violet-500/20 hover:text-violet-300"
                aria-label="Email"
              >
                <Mail className="size-5" />
              </a>
              <a
                href="tel:+8801234567890"
                className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white transition-colors hover:bg-violet-500/20 hover:text-violet-300"
                aria-label="Phone"
              >
                <Phone className="size-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white transition-colors hover:bg-violet-500/20 hover:text-violet-300"
                aria-label="Website"
              >
                <Globe className="size-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="mt-12 border-white/10" />

        <div
          className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:justify-between py-6 text-xs text-muted-foreground"
        >
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} StudioSpace. All rights reserved.
          </p>
          <div className="flex gap-6 text-center sm:text-right">
            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
