"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import { authClient } from "@/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Explore", href: "/explore", active: false },
  { label: "All-Catagory", href: "/all-catagory", active: false },
  { label: "How It Works", href: "/how-it-works", active: false },
  { label: "About", href: "/about", active: false },
]

export function Navbar() {
  const { data: session } = authClient.useSession()

  const handleSignOut = () => {
    authClient.signOut();
  }

  const user = session?.user;
  const [menuOpen, setMenuOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 text-lg font-black text-white shadow-lg shadow-violet-500/30">
            S
          </span>
          <span className="text-xl font-bold text-white">StudioSpace</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              className={cn(
                "relative text-sm text-white/70 transition-colors hover:text-white",
                link.active &&
                "text-white after:absolute after:-bottom-2.5 after:left-0 after:h-0.5 after:w-full after:bg-white"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {
            user ? <Popover>
              <PopoverTrigger render={<Avatar>
                <AvatarImage referrerPolicy="no-referrer" src={user?.image as string} />
                <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
              </Avatar>}>

              </PopoverTrigger>
              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>{user?.name}</PopoverTitle>
                  <PopoverDescription>{user?.email}</PopoverDescription>
                  <Button onClick={handleSignOut} variant={'destructive'}>SignOut</Button>
                </PopoverHeader>
              </PopoverContent>
            </Popover> : <>
              <Link href={'/signin'}>
                <Button
                  type="button"
                  variant="ghost"
                  className="hidden h-9 rounded-full px-4 text-white hover:bg-white/10 hover:text-white sm:inline-flex"
                >
                  Sign In
                </Button>
              </Link>
              <Link href={'/signup'}>
                <Button
                  type="button"
                  className="h-9 rounded-full bg-gradient-to-r from-violet-600 to-purple-500 px-5 font-semibold text-white shadow-md shadow-violet-500/30 hover:opacity-90"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          }




          <button
            type="button"
            aria-label="Your profile"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <User aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? (
              <X aria-hidden className="size-5" />
            ) : (
              <Menu aria-hidden className="size-5" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          aria-label="Mobile"
          className="border-t border-white/10 bg-black/90 px-4 py-3 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                    link.active && "bg-white/10 text-white"
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
