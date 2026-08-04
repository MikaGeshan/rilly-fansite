"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "Gallery", href: "/gallery" },
    { name: "Schedule", href: "/profile#theater" },
  ];

  const activeFor = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <header className="sticky top-3 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6">
      <nav className="glass-panel flex h-18 items-center justify-between px-3 sm:px-5">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Image
            src="/aprillivels_logo.jpg"
            alt="Aprillivels Logo"
            width={44}
            height={44}
            className="h-11 w-11 rounded-lg object-cover ring-1 ring-pink-200"
            priority
          />
          <div className="min-w-0">
            <p className="truncate text-lg font-black leading-tight text-gradient">
              Aprillivels
            </p>
            <p className="truncate text-[10px] font-bold uppercase text-[var(--soft)]">
              Bong Aprilli Fanbase
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeFor(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className="relative rounded-lg px-3 py-2 text-sm font-extrabold text-[var(--muted)] transition hover:text-[var(--pink-deep)]"
              >
                {isActive && (
                  <motion.span
                    layoutId="activeHeaderNav"
                    className="absolute inset-0 -z-10 rounded-lg bg-pink-50"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="btn-gradient hidden px-4 py-2 text-xs sm:inline-flex"
          >
            Meet Rilly
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="btn-muted grid h-11 w-11 place-items-center md:hidden"
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 bg-current transition ${isOpen ? "top-2 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-2 h-0.5 w-5 bg-current transition ${isOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 bg-current transition ${isOpen ? "top-2 -rotate-45" : "top-4"}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-panel absolute left-4 right-4 mt-2 grid gap-2 p-3 md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-black text-[var(--muted)] hover:bg-pink-50 hover:text-[var(--pink-deep)]"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="btn-gradient px-4 py-3 text-xs"
            >
              Meet Rilly
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
