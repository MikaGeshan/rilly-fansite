"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Profile", href: "/profile" },
    { name: "Gallery", href: "/gallery" },
    { name: "Schedule", href: "/profile#theater" },
  ];

  return (
    <header className="sticky top-4 z-50 mx-auto w-full max-w-6xl px-4 sm:px-6">
      <nav
        className="flex h-20 items-center justify-between rounded-2xl px-4 sm:px-8 shadow-lg relative"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(236,72,153,0.18)",
          boxShadow: "0 4px 30px rgba(236,72,153,0.1), 0 1px 0 rgba(251,191,36,0.1)",
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group" id="header-logo-link">
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, #ec4899, #f59e0b)", filter: "blur(8px)" }}
            />
            <Image
              src="/aprillivels_logo.jpg"
              alt="Aprillivels Logo"
              width={42}
              height={42}
              className="relative rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={{ border: "2px solid rgba(236,72,153,0.3)" }}
            />
          </div>
          <div className="flex flex-col">
            <span className="shimmer-text font-black tracking-tight text-xl">
              Aprillivels
            </span>
            <span
              className="text-[9px] font-mono tracking-[0.28em] uppercase font-bold -mt-0.5"
              style={{ color: "#b494a9" }}
            >
              Official Fanbase
            </span>
          </div>
        </Link>

        {/* Navigation Elements */}
        <div className="flex items-center gap-4">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  id={`nav-${item.name.toLowerCase()}`}
                  className="relative text-sm font-bold uppercase tracking-wider group/nav"
                  style={{
                    color: isActive ? "#ec4899" : "#7b5572",
                  }}
                >
                  {item.name}
                  <span
                    className="absolute -bottom-1 left-0 h-0.5 rounded-full transition-all duration-300"
                    style={{
                      background: "linear-gradient(90deg, #ec4899, #f59e0b)",
                      width: isActive ? "100%" : "0%",
                    }}
                  />
                </Link>
              );
            })}
          </div>

          {/* CTA Button (Desktop & Tablet) */}
          <Link
            href="/profile"
            id="header-cta-btn"
            className="btn-gradient hidden sm:inline-flex items-center gap-2 text-[11px] px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span>✨</span> Meet Rilly
          </Link>

          {/* Burger Button for Mobile */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl bg-pink-50 hover:bg-pink-100/80 border border-pink-100/55 transition-all cursor-pointer text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-4 right-4 mt-2 origin-top rounded-2xl p-6 shadow-2xl md:hidden border border-pink-100/40 z-50 flex flex-col gap-3"
            style={{
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 20px 40px rgba(236,72,153,0.12), 0 1px 1px rgba(0,0,0,0.05)",
            }}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200"
                  style={{
                    color: isActive ? "#ec4899" : "#7b5572",
                    background: isActive ? "rgba(236,72,153,0.05)" : "transparent",
                  }}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="text-pink-500">🌸</span>}
                </Link>
              );
            })}
            <div className="h-px bg-pink-100/50 my-1" />
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="btn-gradient w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black text-white shadow-md"
            >
              <span>✨</span> Meet Rilly
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
