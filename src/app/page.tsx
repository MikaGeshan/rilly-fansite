"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";

interface ShowData {
  title: string;
  date: string;
  start_time: string;
}

/* ---------------------------------------------------------------
   Floating particle config
--------------------------------------------------------------- */
const PARTICLES = [
  { id: 1, size: 22, delay: 0,   x: "7%",  y: "14%", symbol: "🎵" },
  { id: 2, size: 34, delay: 2.2, x: "88%", y: "20%", symbol: "🌸" },
  { id: 3, size: 26, delay: 4.5, x: "44%", y: "40%", symbol: "✨" },
  { id: 4, size: 38, delay: 1.0, x: "80%", y: "65%", symbol: "🎵" },
  { id: 5, size: 28, delay: 3.1, x: "11%", y: "75%", symbol: "🌟" },
  { id: 6, size: 30, delay: 5.0, x: "52%", y: "90%", symbol: "🌸" },
];

export default function Home() {
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);
  const [shows, setShows]                 = useState<ShowData[]>([]);
  const [loadingShows, setLoadingShows]   = useState(true);
  const [mousePos, setMousePos]           = useState({ x: 0, y: 0 });

  useEffect(() => {
    const loadShows = async () => {
      try {
        setLoadingShows(true);
        const now   = new Date();
        const month = now.getMonth() + 1;
        const year  = now.getFullYear();
        const res   = await fetch(`/api/schedule?month=${month}&year=${year}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) { setShows(data); return; }
        }
        throw new Error("Failed to load schedule");
      } catch {
        setShows([]);
      } finally {
        setLoadingShows(false);
      }
    };
    loadShows();
  }, []);

  const handleMouseMove = (e: React.MouseEvent) =>
    setMousePos({ x: e.clientX, y: e.clientY });

  const handleCopyHashtag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedHashtag(tag);
    setTimeout(() => setCopiedHashtag(null), 2000);
  };

  const hashtags = [
    { tag: "#MornRill",    title: "Sapaan Pagi",            desc: "Hashtag untuk menyambut pagi hari bersama Rilly. Mulai hari dengan energi harmoni positif." },
    { tag: "#NightRill",   title: "Sapaan Malam",           desc: "Hashtag penutup hari sebelum tidur. Kirimkan pesan malam hangat untuk mengakhiri hari bersama Rilly." },
    { tag: "#fRillday",    title: "Pap hari Jumat",         desc: "Momen mingguan setiap hari Jumat untuk membagikan foto, fancam, atau cerita menarik tentang Rilly." },
    { tag: "#NgabubuRill", title: "Sebelum Berbuka",        desc: "Hashtag khusus bulan Ramadan untuk mengirimkan pesan hangat sebelum berbuka puasa bersama Rilly." },
    { tag: "#InRilLive",   title: "Live Streaming",         desc: "Hashtag untuk berbagi konten live streaming Rilly." },
    { tag: "#RillCall",    title: "Video Call bersama Rilly",desc: "Hashtag untuk berbagi konten video call dengan Rilly." },
    { tag: "#CoveRill",    title: "Rilly's Cover",          desc: "Hashtag untuk meramaikan konten cover lagu yang dibawakan Rilly." },
    { tag: "#HaRillybur",  title: "Liburan bersama Rilly",  desc: "Hashtag khusus yang digunakan saat Rilly sedang menikmati waktu libur atau jeda aktivitas theater." },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden w-full max-w-full"
      style={{ background: "var(--bg-page)" }}
    >
      {/* ── Cursor spotlight ── */}
      <motion.div
        className="pointer-events-none fixed -z-10 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, rgba(251,191,36,0.08) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: mousePos.x - 250, y: mousePos.y - 250 }}
        transition={{ type: "spring", damping: 45, stiffness: 75, mass: 0.8 }}
      />

      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: -20 }}>
        <div className="orb-pink absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full" />
        <div className="orb-yellow absolute bottom-[10%] right-[-8%] w-[500px] h-[500px] rounded-full" />
        <div className="orb-pink absolute top-[55%] left-[35%] w-[350px] h-[350px] rounded-full opacity-40" />
      </div>

      {/* ── Floating emoji particles ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: -5 }}>
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{ position: "absolute", left: p.x, top: p.y, fontSize: p.size, opacity: 0.13 }}
            animate={{ y: [0, -32, 0], x: [0, 12, 0], rotate: [0, 360] }}
            transition={{ duration: 11 + p.id * 2.8, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
          >
            {p.symbol}
          </motion.div>
        ))}
      </div>

      <Header />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16">

        {/* ════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════ */}
        <section id="hero" className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-[2.5rem] min-h-[78vh] md:min-h-[86vh] flex items-center justify-center p-8 md:p-16 shadow-2xl">
          {/* Gradient overlay behind image */}
          <div
            className="absolute inset-0 rounded-[2.5rem]"
            style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.55) 0%, rgba(251,191,36,0.40) 50%, rgba(255,248,210,0.30) 100%)" }}
          />
          <Image
            src="/rilly_stage.jpg"
            alt="Rilly JKT48 Stage Performance"
            fill
            priority
            loading="eager"
            className="object-cover object-center rounded-[2.5rem]"
            style={{ opacity: 0.5, mixBlendMode: "luminosity" }}
            sizes="(max-width: 768px) 100vw, 1152px"
          />
          {/* Bottom fade */}
          <div
            className="absolute inset-0 rounded-[2.5rem]"
            style={{ background: "linear-gradient(to top, rgba(255,248,249,0.95) 0%, rgba(255,248,249,0.20) 45%, transparent 100%)" }}
          />
          {/* Top badge glow strip */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 rounded-t-[2.5rem]"
            style={{ background: "linear-gradient(90deg, #ec4899, #f59e0b, #ec4899)" }}
          />

          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-3xl flex flex-col items-center"
            >
              <span
                className="inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.45em] font-black mb-5 px-4 py-1.5 rounded-full"
                style={{
                  background: "rgba(236,72,153,0.12)",
                  color: "#ec4899",
                  border: "1px solid rgba(236,72,153,0.25)",
                }}
              >
                🌸 Official Fanbase of Bong Aprilli
              </span>

              <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none mb-6 drop-shadow-xl">
                <span className="shimmer-text">Aprillivels</span>
              </h1>

              <p
                className="text-base md:text-xl leading-relaxed max-w-2xl mb-10 font-semibold"
                style={{ color: "#7b5572" }}
              >
                Rumah dukungan untuk Rilly JKT48. Mari bersama menjadi tangga
                yang mengiringi perjalanan Bong Aprilli untuk meraih impiannya
                di JKT48 ✨
              </p>

              <Link
                href="/profile"
                id="hero-cta-btn"
                className="btn-gradient inline-flex items-center gap-2 text-sm px-9 py-4"
              >
                <span>🌟</span> More About Rilly
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
              className="mt-16 grid grid-cols-2 gap-4 w-full max-w-sm"
            >
              {[
                { value: "13th", label: "Generation" },
                { value: "Bong", label: "Aprilli" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl px-4 py-5 text-center glass-card"
                  style={{ background: "rgba(255,255,255,0.70)" }}
                >
                  <p className="text-xl md:text-3xl font-black leading-none text-gradient">
                    {stat.value}
                  </p>
                  <p
                    className="text-[9px] uppercase tracking-[0.2em] mt-2 font-bold"
                    style={{ color: "#b494a9" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════════════════════════
            THEATER SCHEDULE
        ════════════════════════════════════ */}
        <section id="theater" className="mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[2.5rem] overflow-hidden p-10 md:p-14 shadow-xl"
            style={{
              background: "linear-gradient(145deg, #fff8f9 0%, #fdf2f8 50%, #fffbeb 100%)",
              border: "1px solid rgba(236,72,153,0.15)",
              boxShadow: "var(--shadow-pink)",
            }}
          >
            {/* Background accent glows */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)" }}
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)" }}
            />

            {/* Top stripe */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-[2.5rem]"
              style={{ background: "linear-gradient(90deg, #ec4899, #f59e0b)" }}
            />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-10 gap-4"
              style={{ borderBottom: "1px solid rgba(236,72,153,0.15)" }}
            >
              <div>
                <p
                  className="text-[9px] uppercase tracking-[0.38em] font-bold mb-2"
                  style={{ color: "#f59e0b" }}
                >
                  Stage Performance
                </p>
                <h2 className="font-black text-4xl md:text-5xl tracking-tight text-gradient">
                  Theater Schedule
                </h2>
              </div>
              <span
                className="inline-flex items-center gap-2 text-xs font-mono font-bold px-4 py-1.5 rounded-full"
                style={{
                  background: "rgba(236,72,153,0.08)",
                  color: "#ec4899",
                  border: "1px solid rgba(236,72,153,0.2)",
                }}
              >
                🎭 This Month
              </span>
            </div>

            <div className="relative z-10">
              {loadingShows ? (
                <div
                  className="flex items-center justify-center py-16 font-bold tracking-widest text-sm animate-pulse"
                  style={{ color: "#ec4899" }}
                >
                  Menyelaraskan frekuensi teater...
                </div>
              ) : shows.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shows.map((show, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="rounded-2xl p-6 glass-card cursor-default"
                      style={{ background: "rgba(255,255,255,0.80)" }}
                    >
                      <span
                        className="text-[9px] font-mono uppercase tracking-[0.28em] font-bold"
                        style={{ color: "#ec4899" }}
                      >
                        Show #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <p
                        className="font-black text-lg mt-2 leading-tight"
                        style={{ color: "#1c0b15" }}
                      >
                        {show.title}
                      </p>
                      <div
                        className="mt-4 flex items-center justify-between text-[10px] font-mono"
                        style={{ color: "#b494a9" }}
                      >
                        <span>📅 {show.date}</span>
                        <span
                          className="rounded-full px-2.5 py-0.5 font-bold"
                          style={{
                            background: "rgba(251,191,36,0.15)",
                            color: "#f59e0b",
                            border: "1px solid rgba(251,191,36,0.3)",
                          }}
                        >
                          {show.start_time} WIB
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-16 rounded-2xl"
                  style={{
                    border: "1.5px dashed rgba(236,72,153,0.25)",
                    background: "rgba(236,72,153,0.03)",
                  }}
                >
                  <p className="text-3xl mb-3">🎭</p>
                  <p
                    className="font-black tracking-widest text-sm uppercase"
                    style={{ color: "#b494a9" }}
                  >
                    To Be Announced
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#b494a9" }}>
                    Jadwal belum tersedia untuk bulan ini.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════
            VISUAL GALLERY TEASER
        ════════════════════════════════════ */}
        <section id="gallery" className="mt-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-[2.5rem] overflow-hidden p-8 md:p-14 shadow-xl flex flex-col lg:flex-row items-center gap-10"
            style={{
              background: "linear-gradient(145deg, #fffbeb 0%, #fdf2f8 50%, #fff8f9 100%)",
              border: "1px solid rgba(236,72,153,0.15)",
              boxShadow: "var(--shadow-yellow)",
            }}
          >
            {/* Top stripe accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ background: "linear-gradient(90deg, #f59e0b, #ec4899)" }}
            />

            {/* Left Content */}
            <div className="flex-1 z-10 text-center lg:text-left">
              <p
                className="text-[9px] uppercase tracking-[0.38em] font-bold mb-2"
                style={{ color: "#ec4899" }}
              >
                Moments &amp; Memories
              </p>
              <h2 className="text-4xl md:text-5xl font-black leading-none text-gradient mb-6">
                Visual Gallery
              </h2>
              <p className="text-sm md:text-base leading-relaxed mb-8 font-medium" style={{ color: "#7b5572" }}>
                Jelajahi keindahan momen panggung teater, potret resmi (Kabesha), dan senyuman hangat Bong Aprilli Paskah melalui halaman galeri foto khusus kami.
              </p>
              <Link
                href="/gallery"
                className="btn-gradient inline-flex items-center gap-2 text-xs px-8 py-3.5"
              >
                <span>📸</span> Jelajahi Galeri Foto →
              </Link>
            </div>

            {/* Right Preview Cards Stack */}
            <div className="flex-1 w-full max-w-md relative h-[280px] sm:h-[320px] flex items-center justify-center">
              {/* Back Card (Stage Preview) */}
              <div
                className="absolute w-[240px] h-[180px] rounded-2xl overflow-hidden shadow-lg border border-pink-100 rotate-[-8deg] translate-x-[-20px] translate-y-[-10px] opacity-70 group-hover:rotate-[-12deg] transition-transform duration-300"
              >
                <Image
                  src="/rilly_stage.jpg"
                  alt="Rilly JKT48 Stage Preview"
                  fill
                  className="object-cover"
                  sizes="240px"
                />
              </div>

              {/* Front Card (Portrait Preview) */}
              <div
                className="absolute w-[180px] h-[240px] rounded-2xl overflow-hidden shadow-2xl border-2 border-white rotate-[6deg] translate-x-[30px] translate-y-[10px]"
                style={{ boxShadow: "0 10px 25px rgba(236,72,153,0.15)" }}
              >
                <Image
                  src="/rilly_profile.jpg"
                  alt="Rilly JKT48 Portrait Preview"
                  fill
                  className="object-cover"
                  sizes="180px"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(236,72,153,0.4) 0%, transparent 100%)" }}
                />
              </div>
            </div>
          </motion.div>
        </section>

        {/* ════════════════════════════════════
            HASHTAG GUIDE
        ════════════════════════════════════ */}
        <section id="hashtag-guide" className="relative mt-28 py-16 md:py-24 overflow-hidden">
          {/* Divider line */}
          <div className="gradient-divider mb-16" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12"
          >
            <div className="max-w-3xl">
              <p
                className="text-[9px] uppercase tracking-[0.38em] font-bold mb-2"
                style={{ color: "#f59e0b" }}
              >
                Community Tags
              </p>
              <h2 className="text-5xl md:text-7xl font-black leading-none text-gradient">
                Hashtag Guide
              </h2>
              <p className="text-sm md:text-base leading-relaxed max-w-2xl mt-4 font-medium" style={{ color: "#7b5572" }}>
                Hashtag resmi untuk meramaikan konten dan interaksi bersama Rilly.
                Gunakan hashtag ini untuk berbagi momen, dan dukungan menarik tentang
                perjalanan Bong Aprilli di JKT48.
              </p>
            </div>
            <div
              className="rounded-2xl px-6 py-5 glass-card"
              style={{ background: "rgba(255,255,255,0.75)", minWidth: 160 }}
            >
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold mb-1" style={{ color: "#b494a9" }}>
                Total Tags
              </p>
              <p className="text-3xl font-black text-gradient">8 Tags</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hashtags.map((h, index) => (
              <motion.article
                key={h.tag}
                id={`hashtag-card-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-2xl p-6 md:p-7 min-h-[230px] overflow-hidden flex flex-col justify-between glass-card group/htag cursor-default"
                style={{
                  background: "linear-gradient(145deg, rgba(255,251,235,0.90) 0%, rgba(253,242,248,0.90) 100%)",
                  border: "1px solid rgba(236,72,153,0.14)",
                  boxShadow: "0 2px 20px rgba(236,72,153,0.06)",
                }}
              >
                {/* Top accent stripe */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                  style={{ background: "linear-gradient(90deg, #ec4899, #f59e0b)" }}
                />

                {/* Giant background # */}
                <span
                  className="absolute -right-3 -bottom-8 text-[8rem] font-black leading-none select-none pointer-events-none transition-all duration-500 group-hover/htag:scale-110"
                  style={{ color: "rgba(236,72,153,0.06)" }}
                >
                  #
                </span>

                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.25em]"
                        style={{ color: "#b494a9" }}
                      >
                        {h.title}
                      </span>
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: "rgba(236,72,153,0.09)",
                          color: "#ec4899",
                          border: "1px solid rgba(236,72,153,0.2)",
                        }}
                      >
                        0{index + 1}
                      </span>
                    </div>
                    <h3 className="font-bold text-2xl md:text-3xl tracking-tight mb-3 text-gradient">
                      {h.tag}
                    </h3>
                    <p className="text-xs md:text-sm leading-relaxed" style={{ color: "#7b5572" }}>
                      {h.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyHashtag(h.tag)}
                    type="button"
                    id={`copy-hashtag-${index}`}
                    className="mt-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] transition-all duration-200 hover:gap-3"
                    style={{
                      color: copiedHashtag === h.tag ? "#ec4899" : "#b494a9",
                    }}
                  >
                    {copiedHashtag === h.tag ? "✔ Copied!" : "Copy Tag →"}
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
