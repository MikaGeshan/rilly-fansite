"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Loading } from "@/components/ui/loading";
import { type GalleryItem, useGalleryStore } from "@/stores/gallery-store";

function GalleryCard({
  item,
  idx,
  onOpen,
}: {
  item: GalleryItem;
  idx: number;
  onOpen: (item: GalleryItem) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.42, delay: idx * 0.025 }}
      whileHover={{ y: -5 }}
      onClick={() => onOpen(item)}
      className="glass-panel mb-5 w-full break-inside-avoid overflow-hidden p-2 text-left"
    >
      <div className="relative min-h-60 overflow-hidden rounded-md bg-white">
        {!loaded && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/60">
            <Loading variant="pulse" size="sm" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`h-auto w-full object-contain transition duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-2 py-3">
        <p className="text-xs font-black uppercase text-[var(--muted)]">
          {item.date}
        </p>
        <span className="text-xs font-black text-[var(--pink-deep)]">Open</span>
      </div>
    </motion.button>
  );
}

export default function GalleryPage() {
  const activeItem = useGalleryStore((state) => state.activeItem);
  const items = useGalleryStore((state) => state.items);
  const loading = useGalleryStore((state) => state.loading);
  const loadingMore = useGalleryStore((state) => state.loadingMore);
  const hasMore = useGalleryStore((state) => state.hasMore);
  const error = useGalleryStore((state) => state.error);
  const setActiveItem = useGalleryStore((state) => state.setActiveItem);
  const loadPage = useGalleryStore((state) => state.loadPage);
  const loadNextPage = useGalleryStore((state) => state.loadNextPage);
  const retryCurrentPage = useGalleryStore((state) => state.retryCurrentPage);

  useEffect(() => {
    loadPage(1, true);
  }, [loadPage]);

  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 pt-14 sm:px-6 lg:px-8">
        <section className="mb-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <span className="eyebrow">Rilly Memories</span>
            <h1 className="mt-5 text-5xl font-black leading-tight tracking-tight text-gradient sm:text-6xl">
              Rilly&apos;s Daily Dose
            </h1>
          </div>
          <p className="max-w-2xl text-base font-semibold leading-8 text-[var(--muted)]">
            Galeri dibuat lebih lapang, mudah dipindai, dan tetap fokus pada
            media. Sentuh foto untuk melihat versi besar dan akses sumber
            aslinya.
          </p>
        </section>

        {loading ? (
          <div className="flex min-h-[380px] items-center justify-center">
            <Loading variant="dots" size="lg" label="Memuat Galeri Rilly..." />
          </div>
        ) : error && items.length === 0 ? (
          <div
            className="max-w-md mx-auto p-10 text-center rounded-[2.5rem] border border-pink-100"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(253,242,248,0.8))",
              boxShadow: "var(--shadow-pink)",
            }}
          >
            <p className="text-4xl mb-4">😢</p>
            <h3 className="text-lg font-black text-gradient mb-2">
              Gagal Memuat Galeri
            </h3>
            <p className="text-xs font-semibold" style={{ color: "#7b5572" }}>
              {error}
            </p>
            <button
              onClick={() => loadPage(1, true)}
              className="btn-gradient mt-6 inline-flex items-center gap-2 text-xs px-6 py-3 cursor-pointer font-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>🔄</span>
              <span>Coba Lagi</span>
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="glass-panel mx-auto max-w-lg p-10 text-center">
            <h3 className="text-2xl font-black text-gradient">Galeri Kosong</h3>
            <p className="mt-3 text-sm font-semibold text-[var(--muted)]">
              Gagal mendapatkan media. Silakan coba lagi nanti.
            </p>
          </div>
        ) : (
          <>
            <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
              {items.map((item, idx) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  idx={idx}
                  onOpen={setActiveItem}
                />
              ))}
            </div>

            {error && (
              <p
                className="mt-8 text-center text-xs font-semibold"
                style={{ color: "#ec4899" }}
              >
                {error} —{" "}
                <button
                  onClick={() => retryCurrentPage()}
                  className="underline cursor-pointer"
                >
                  Coba lagi
                </button>
              </p>
            )}

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => loadNextPage()}
                  disabled={loadingMore}
                  className="btn-gradient px-6 py-3 text-sm disabled:opacity-60"
                >
                  {loadingMore ? (
                    <>
                      <Loading variant="spinner" size="sm" />
                      Memuat Foto
                    </>
                  ) : (
                    "Tampilkan Lebih Banyak"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-[rgba(36,19,28,0.88)] p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel relative flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden bg-white"
            >
              <div className="relative h-[72vh] w-full bg-[var(--ink)]">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
              <div className="flex flex-col gap-3 border-t border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-bold text-[var(--muted)]">
                  Diposting pada {activeItem.date}
                </p>
                {activeItem.link && (
                  <a
                    href={activeItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-black text-[var(--pink-deep)]"
                  >
                    Buka di Instagram
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-lg bg-white/90 text-lg font-black text-[var(--pink-deep)]"
                aria-label="Tutup galeri"
              >
                x
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
