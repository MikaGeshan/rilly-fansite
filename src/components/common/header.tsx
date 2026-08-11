"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <span className="relative h-4 w-5" aria-hidden="true">
      <span
        className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition duration-200 ${isOpen ? "top-2 rotate-45" : "top-0"}`}
      />
      <span
        className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition duration-200 ${isOpen ? "opacity-0" : "opacity-100"}`}
      />
      <span
        className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition duration-200 ${isOpen ? "top-2 -rotate-45" : "top-4"}`}
      />
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
      <path
        d="M5 10h9m0 0-3.4-3.4M14 10l-3.4 3.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "Gallery", href: "/gallery" },
    { name: "Schedule", href: "/profile#theater" },
  ];
  const registerHref = "https://forms.gle/XFUjzxHQDCePHnT6A";

  const activeFor = (href: string) => {
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <header className="sticky top-4 z-50 w-full px-3 sm:px-6">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex min-h-14 w-full max-w-5xl items-center justify-between gap-2 rounded-full border border-pink-200/60 bg-white/88 px-2.5 py-1.5 shadow-[0_12px_36px_rgba(190,24,93,0.10)] backdrop-blur-xl"
      >
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-2 rounded-full py-1 pl-1 pr-2 transition duration-200 hover:bg-pink-50/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:pr-3"
          aria-label="Aprillivels home"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white p-0.5 shadow-[0_6px_18px_rgba(190,24,93,0.14)] ring-1 ring-pink-100">
            <Image
              src="/aprillivels_logo.jpg"
              alt=""
              width={34}
              height={34}
              className="h-8 w-8 rounded-full object-cover"
              priority
            />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-black leading-tight text-gradient sm:text-base">
              Aprillivels
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = activeFor(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)] ${
                  isActive
                    ? "text-[var(--pink-deep)]"
                    : "text-[var(--muted)] hover:bg-pink-50/75 hover:text-[var(--pink-deep)]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeHeaderNav"
                    className="absolute inset-0 -z-10 rounded-full bg-[linear-gradient(135deg,rgba(244,63,143,0.12),rgba(255,216,77,0.16))] ring-1 ring-pink-200/70"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--pink)]" />
                )}
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={registerHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden min-h-10 items-center rounded-full border border-pink-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,240,248,0.94))] px-4 py-2 text-xs font-black text-[var(--pink-deep)] shadow-[0_8px_24px_rgba(190,24,93,0.10)] transition duration-200 hover:-translate-y-0.5 hover:border-pink-300 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)] focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:inline-flex"
          >
            <span>Regist Now!</span>
            <ArrowIcon />
          </a>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="grid h-10 w-10 place-items-center rounded-full border border-pink-200 bg-white/82 text-[var(--pink-deep)] shadow-sm transition duration-200 hover:bg-pink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)] focus-visible:ring-offset-2 focus-visible:ring-offset-white md:hidden"
          >
            <MenuIcon isOpen={isOpen} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="absolute left-3 right-3 mt-2 grid gap-1.5 rounded-3xl border border-pink-200/70 bg-white/94 p-2.5 shadow-[0_18px_44px_rgba(190,24,93,0.14)] backdrop-blur-xl sm:left-6 sm:right-6 md:hidden"
          >
            {navItems.map((item) => {
              const isActive = activeFor(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full px-4 py-3 text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)] ${
                    isActive
                      ? "bg-pink-50 text-[var(--pink-deep)] ring-1 ring-pink-200"
                      : "text-[var(--muted)] hover:bg-pink-50 hover:text-[var(--pink-deep)]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <a
              href={registerHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="mt-1 flex min-h-11 items-center justify-center gap-2 rounded-full bg-[linear-gradient(95deg,var(--pink-deep),var(--pink),var(--yellow-deep))] px-4 py-3 text-xs font-black text-white shadow-[0_10px_28px_rgba(190,24,93,0.18)] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pink)]"
            >
              <span>Regist Now!</span>
              <ArrowIcon />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
