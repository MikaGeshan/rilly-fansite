"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Loading } from "@/components/ui/loading";
import { supabase } from "@/lib/supabase";

const PARTICLES = [
  { id: 1, size: 22, delay: 0, x: "10%", y: "15%", symbol: "🎵" },
  { id: 2, size: 34, delay: 2.2, x: "85%", y: "25%", symbol: "🌸" },
  { id: 3, size: 26, delay: 4.5, x: "40%", y: "45%", symbol: "✨" },
  { id: 4, size: 38, delay: 1.0, x: "75%", y: "70%", symbol: "🎵" },
  { id: 5, size: 28, delay: 3.1, x: "15%", y: "80%", symbol: "🌟" },
];

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  className: string;
  shadow: string;
  link: string;
  date: string;
}

function GalleryCard({
  item,
  idx,
  setActiveItem,
}: {
  item: GalleryItem;
  idx: number;
  setActiveItem: (item: GalleryItem) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.04 }}
      whileHover={{ y: -12, scale: 1.03, rotate: 0 }}
      onClick={() => setActiveItem(item)}
      className={`break-inside-avoid relative overflow-hidden rounded-[2.5rem] shadow-2xl group cursor-pointer border-4 border-white transition-all duration-300 ${item.className} mb-8`}
      style={{
        boxShadow: `0 20px 40px rgba(0,0,0,0.06), ${item.shadow}`,
        minHeight: "240px",
      }}
    >
      {/* Loading Skeleton Placeholder inside the polaroid */}
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-50/40 dark:bg-zinc-950/40 backdrop-blur-sm">
          <Loading variant="pulse" size="sm" />
        </div>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-auto object-contain transition-all duration-700 ease-out group-hover:scale-105 ${
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
        }`}
      />

      {/* Hover info overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
        <p className="text-[10px] font-mono text-zinc-300 font-bold flex items-center gap-1">
          📅 {item.date}
        </p>
      </div>

      {/* Soft aesthetic gradient border on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(236,72,153,0.15) 0%, rgba(251,191,36,0.05) 100%)",
          mixBlendMode: "overlay",
        }}
      />
    </motion.div>
  );
}

export default function GalleryPage() {
  const PAGE_SIZE = 12;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  async function loadScrapedMedia(pageNum: number, isInitial = false) {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      const fromRange = (pageNum - 1) * PAGE_SIZE;
      const toRange = pageNum * PAGE_SIZE - 1;

      // Fetch only designated columns with range pagination
      const { data, error } = await supabase
        .from("media")
        .select("payload, link, date, shortcode")
        .order("date", { ascending: false })
        .range(fromRange, toRange);

      if (error) throw error;

      if (Array.isArray(data)) {
        const styledItems = data.map((item: any, idx: number) => {
          const rotations = [
            "rotate-[-2deg]",
            "rotate-[1deg]",
            "rotate-[-1deg]",
            "rotate-[2deg]",
          ];
          const shadows = ["var(--shadow-pink)", "var(--shadow-yellow)"];

          // Format date for the UI
          const formattedDate = item.date
            ? new Date(item.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Tanggal tidak diketahui";

          const globalIdx = fromRange + idx;

          return {
            id: `${item.shortcode || "scraped"}-${globalIdx}`,
            src: item.payload || "", // Pass Base64 data URL directly
            alt: `Media Bong Aprilli JKT48`,
            className: rotations[globalIdx % rotations.length],
            shadow: shadows[globalIdx % shadows.length],
            link: item.link || "",
            date: formattedDate,
          };
        });

        if (isInitial) {
          setItems(styledItems);
        } else {
          setItems((prev) => [...prev, ...styledItems]);
        }

        // If we fetched fewer items than the page size, we reached the end
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (err) {
      console.error("Could not load scraped media from Supabase:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Gagal memuat media. Silakan coba lagi nanti.",
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    loadScrapedMedia(1, true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden w-full flex flex-col"
      style={{ background: "var(--bg-page)" }}
    >
      {/* ── Spotlight Cursor ── */}
      <motion.div
        className="pointer-events-none fixed -z-10 h-[480px] w-[480px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(251,191,36,0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: mousePos.x - 240, y: mousePos.y - 240 }}
        transition={{ type: "spring", damping: 45, stiffness: 75, mass: 0.8 }}
      />

      {/* ── Ambient Background Orbs ── */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: -20 }}
      >
        <div className="orb-pink absolute top-[-5%] left-[-5%] w-[550px] h-[550px] rounded-full" />
        <div className="orb-yellow absolute bottom-[10%] right-[-5%] w-[450px] h-[450px] rounded-full" />
      </div>

      {/* ── Floating Emoji Particles ── */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ zIndex: -5 }}
      >
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              fontSize: p.size,
              opacity: 0.12,
            }}
            animate={{ y: [0, -30, 0], x: [0, 10, 0], rotate: [0, 360] }}
            transition={{
              duration: 12 + p.id * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </div>

      <Header />

      <main className="flex-grow mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-24">
        {/* ── Page Header ── */}
        <div className="text-center mb-16">
          <span
            className="text-[10px] md:text-xs uppercase tracking-[0.38em] font-black block mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(236,72,153,0.10)",
              color: "#ec4899",
              border: "1px solid rgba(236,72,153,0.22)",
            }}
          >
            📸 Rilly`s Memories
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight shimmer-text mt-4">
            Rilly`s Daily Dose
          </h1>
          <p
            className="mt-3 text-sm md:text-base font-medium max-w-2xl mx-auto"
            style={{ color: "#7b5572" }}
          >
            Sentuh foto untuk memperbesar tampilan dan melihat detail panggung
            Bong Aprilli JKT48.
          </p>
        </div>

        {/* ── Masonry Column Gallery Grid ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[350px]">
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
              onClick={() => loadScrapedMedia(1, true)}
              className="btn-gradient mt-6 inline-flex items-center gap-2 text-xs px-6 py-3 cursor-pointer font-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span>🔄</span>
              <span>Coba Lagi</span>
            </button>
          </div>
        ) : items.length === 0 ? (
          <div
            className="max-w-md mx-auto p-10 text-center rounded-[2.5rem] border border-pink-100"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(253,242,248,0.8))",
              boxShadow: "var(--shadow-pink)",
            }}
          >
            <p className="text-4xl mb-4">🌸</p>
            <h3 className="text-lg font-black text-gradient mb-2">
              Galeri Kosong
            </h3>
            <p className="text-xs font-semibold" style={{ color: "#7b5572" }}>
              Belum ada media untuk ditampilkan.
            </p>
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 md:columns-3 gap-8 [column-fill:_balance]">
              {items.map((item, idx) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  idx={idx}
                  setActiveItem={setActiveItem}
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
                  onClick={() => loadScrapedMedia(page, false)}
                  className="underline cursor-pointer"
                >
                  Coba lagi
                </button>
              </p>
            )}

            {hasMore && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={() => {
                    const nextPage = page + 1;
                    setPage(nextPage);
                    loadScrapedMedia(nextPage, false);
                  }}
                  disabled={loadingMore}
                  className="btn-gradient inline-flex items-center gap-2 text-xs px-8 py-3.5 cursor-pointer font-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loadingMore ? (
                    <>
                      <Loading variant="spinner" size="sm" />
                      <span>Memuat Foto...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Tampilkan Lebih Banyak</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Image Lightbox Modal ── */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-4xl max-h-[85vh] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-white/20 flex flex-col bg-zinc-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative flex-grow w-full h-[75vh]">
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  className="object-contain animate-fadeIn"
                  sizes="100vw"
                />
              </div>

              {/* Lightbox metadata footer */}
              <div className="bg-zinc-950/60 backdrop-blur-md p-4 flex items-center justify-between border-t border-white/10 text-white">
                <span className="text-xs font-mono text-zinc-300">
                  📅 Diposting pada {activeItem.date}
                </span>
                {activeItem.link && (
                  <a
                    href={activeItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-pink-400 hover:text-pink-300 transition-colors duration-200 cursor-pointer"
                  >
                    Buka di Instagram ↗
                  </a>
                )}
              </div>

              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white text-lg font-bold transition-all cursor-pointer z-10"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
