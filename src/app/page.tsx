"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { CursorSpotlight } from "@/components/ui/cursor-spotlight";
import { FloatingParticles, type Particle } from "@/components/ui/floating-particles";
import { EmptyState } from "@/components/ui/empty-state";
import { useMousePosition } from "@/hooks/use-mouse-position";
import { formatDateID } from "@/lib/utils";

interface FanLetter {
  id: string;
  sender: string;
  type: "Dukungan" | "Penyemangat" | "Harapan" | "Salam Panggung";
  message: string;
  theme: "pink" | "yellow" | "gradient" | "glass";
  createdAt: string;
  likes: number;
}

const DEFAULT_LETTERS: FanLetter[] = [
  {
    id: "1",
    sender: "Reza Prasetya",
    type: "Dukungan",
    message: "Rilly, semangat terus ya jalani hari-hari sebagai Trainee JKT48! Bakat menyanyi kamu luar biasa merdu, kami semua di sini akan selalu mendukungmu sampai jadi member reguler! 🌟",
    theme: "pink",
    createdAt: "11 Juli 2026",
    likes: 12
  },
  {
    id: "2",
    sender: "Indah Wahyuni",
    type: "Penyemangat",
    message: "Suara kamu pas bawain 'Rapsodi' di JKT48 School keren banget! Bener-bener harmoni indah yang selalu berirama di benakku, seperti jikoshoukai-mu! Sukses terus ya Rilly! 🌸",
    theme: "yellow",
    createdAt: "10 Juli 2026",
    likes: 8
  },
  {
    id: "3",
    sender: "Dwi Nugroho",
    type: "Harapan",
    message: "Semoga Rilly selalu diberikan kesehatan dan kelancaran dalam setiap show teater JKT48. Nggak sabar mau nonton langsung Rilly di teater akhir pekan ini! Tetap bersinar! ✨",
    theme: "gradient",
    createdAt: "09 Juli 2026",
    likes: 15
  }
];

/* ---------------------------------------------------------------
   Floating particle config
--------------------------------------------------------------- */
const PARTICLES: Particle[] = [
  { id: 1, size: 22, delay: 0,   x: "7%",  y: "14%", symbol: "🎵" },
  { id: 2, size: 34, delay: 2.2, x: "88%", y: "20%", symbol: "🌸" },
  { id: 3, size: 26, delay: 4.5, x: "44%", y: "40%", symbol: "✨" },
  { id: 4, size: 38, delay: 1.0, x: "80%", y: "65%", symbol: "🎵" },
  { id: 5, size: 28, delay: 3.1, x: "11%", y: "75%", symbol: "🌟" },
  { id: 6, size: 30, delay: 5.0, x: "52%", y: "90%", symbol: "🌸" },
];

export default function Home() {
  const { mousePos, handleMouseMove }     = useMousePosition();
  const [letters, setLetters]             = useState<FanLetter[]>([]);
  const [sender, setSender]               = useState("");
  const [type, setType]                   = useState<FanLetter["type"]>("Dukungan");
  const [message, setMessage]             = useState("");
  const [themeOption, setThemeOption]     = useState<FanLetter["theme"]>("pink");
  const [submitted, setSubmitted]         = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rilly_fan_letters");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLetters(JSON.parse(saved));
      } catch {
        setLetters(DEFAULT_LETTERS);
      }
    } else {
      setLetters(DEFAULT_LETTERS);
      localStorage.setItem("rilly_fan_letters", JSON.stringify(DEFAULT_LETTERS));
    }
  }, []);

  const handleSubmitLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !message.trim()) return;

    const newLetter: FanLetter = {
      id: Date.now().toString(),
      sender: sender.trim(),
      type,
      message: message.trim(),
      theme: themeOption,
      createdAt: formatDateID(new Date()),
      likes: 0
    };

    const updated = [newLetter, ...letters];
    setLetters(updated);
    localStorage.setItem("rilly_fan_letters", JSON.stringify(updated));

    setSender("");
    setMessage("");
    setThemeOption("pink");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleLikeLetter = (id: string) => {
    const updated = letters.map(l => {
      if (l.id === id) {
        return { ...l, likes: l.likes + 1 };
      }
      return l;
    });
    setLetters(updated);
    localStorage.setItem("rilly_fan_letters", JSON.stringify(updated));
  };

  const handleDeleteLetter = (id: string) => {
    const updated = letters.filter(l => l.id !== id);
    setLetters(updated);
    localStorage.setItem("rilly_fan_letters", JSON.stringify(updated));
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden w-full max-w-full"
      style={{ background: "var(--bg-page)" }}
    >
      {/* ── Cursor spotlight ── */}
      <CursorSpotlight mousePos={mousePos} size={500} />

      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: -20 }}>
        <div className="orb-pink absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full" />
        <div className="orb-yellow absolute bottom-[10%] right-[-8%] w-[500px] h-[500px] rounded-full" />
        <div className="orb-pink absolute top-[55%] left-[35%] w-[350px] h-[350px] rounded-full opacity-40" />
      </div>

      {/* ── Floating emoji particles ── */}
      <FloatingParticles
        particles={PARTICLES}
        opacity={0.13}
        floatY={32}
        floatX={12}
        durationBase={11}
        durationFactor={2.8}
      />

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
            FAN LETTER SECTION
        ════════════════════════════════════ */}
        <section id="fan-letter-section" className="relative mt-28 py-16 md:py-24 overflow-hidden">
          {/* Divider line */}
          <div className="gradient-divider mb-16" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Form to write letter */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="rounded-[2rem] p-8 shadow-xl glass-card relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  border: "1px solid rgba(236, 72, 153, 0.15)",
                  boxShadow: "var(--shadow-pink)"
                }}
              >
                {/* Top stripe accent */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: "linear-gradient(90deg, #ec4899, #f59e0b)" }}
                />

                <p
                  className="text-[9px] uppercase tracking-[0.38em] font-black mb-2"
                  style={{ color: "#ec4899" }}
                >
                  Write to Rilly
                </p>
                <h2 className="text-3xl font-black leading-none text-gradient mb-6">
                  Fan Letter
                </h2>
                <p className="text-xs font-semibold mb-6" style={{ color: "#7b5572" }}>
                  Kirimkan surat dukungan manis, salam panggung, atau kata-kata penyemangat untuk Rilly. Pesanmu akan disimpan secara lokal di kotak surat browser ini!
                </p>

                <form onSubmit={handleSubmitLetter} className="flex flex-col gap-4">
                  <div>
                    <label
                      htmlFor="sender-name"
                      className="block text-[10px] uppercase tracking-wider font-bold mb-1.5"
                      style={{ color: "#b494a9" }}
                    >
                      Nama Pengirim
                    </label>
                    <input
                      type="text"
                      id="sender-name"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      placeholder="Masukkan namamu/pseudonim..."
                      required
                      maxLength={40}
                      className="w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.90)",
                        border: "1.5px solid rgba(236, 72, 153, 0.12)",
                        color: "#1c0b15"
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="letter-type"
                      className="block text-[10px] uppercase tracking-wider font-bold mb-1.5"
                      style={{ color: "#b494a9" }}
                    >
                      Jenis Surat
                    </label>
                    <select
                      id="letter-type"
                      value={type}
                      onChange={(e) => setType(e.target.value as FanLetter["type"])}
                      className="w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none appearance-none transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.90)",
                        border: "1.5px solid rgba(236, 72, 153, 0.12)",
                        color: "#1c0b15",
                        backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ec4899' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 1rem center",
                        backgroundSize: "1.2em"
                      }}
                    >
                      <option value="Dukungan">💌 Dukungan</option>
                      <option value="Penyemangat">💪 Penyemangat</option>
                      <option value="Harapan">✨ Harapan</option>
                      <option value="Salam Panggung">🎭 Salam Panggung</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="letter-message"
                      className="block text-[10px] uppercase tracking-wider font-bold mb-1.5"
                      style={{ color: "#b494a9" }}
                    >
                      Isi Pesan
                    </label>
                    <textarea
                      id="letter-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tulis surat dukunganmu di sini..."
                      required
                      maxLength={500}
                      rows={4}
                      className="w-full rounded-xl px-4 py-3 text-sm font-semibold outline-none resize-none transition-all duration-300"
                      style={{
                        background: "rgba(255, 255, 255, 0.90)",
                        border: "1.5px solid rgba(236, 72, 153, 0.12)",
                        color: "#1c0b15"
                      }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-[10px] uppercase tracking-wider font-bold mb-2"
                      style={{ color: "#b494a9" }}
                    >
                      Desain Kartu Surat
                    </label>
                    <div className="flex gap-3">
                      {(["pink", "yellow", "gradient", "glass"] as const).map((opt) => {
                        const styleMap = {
                          pink: "linear-gradient(135deg, #fdf2f8, #fbcfe8)",
                          yellow: "linear-gradient(135deg, #fffbeb, #fde68a)",
                          gradient: "linear-gradient(135deg, #fff1f2, #fffbeb)",
                          glass: "rgba(255, 255, 255, 0.4)"
                        };
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setThemeOption(opt)}
                            className="w-8 h-8 rounded-full border-2 transition-all duration-300 relative cursor-pointer"
                            style={{
                              background: styleMap[opt],
                              borderColor: themeOption === opt ? "#ec4899" : "rgba(236, 72, 153, 0.15)",
                              transform: themeOption === opt ? "scale(1.15)" : "scale(1)",
                              boxShadow: themeOption === opt ? "0 4px 10px rgba(236, 72, 153, 0.25)" : "none"
                            }}
                            title={`Tema: ${opt}`}
                          >
                            {themeOption === opt && (
                              <span className="absolute inset-0 flex items-center justify-center text-white text-[9px] font-black drop-shadow-md">
                                ✓
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-gradient w-full flex items-center justify-center gap-2 text-xs py-3.5 mt-2 cursor-pointer font-black"
                  >
                    <span>📮</span> Kirim Surat Dukungan
                  </button>

                  {submitted && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-xs font-bold mt-2"
                      style={{ color: "#10b981" }}
                    >
                      🎉 Surat berhasil terkirim ke kotak surat!
                    </motion.p>
                  )}
                </form>
              </motion.div>
            </div>

            {/* Right: Box of Letters */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="text-[9px] uppercase tracking-[0.25em] font-bold"
                      style={{ color: "#f59e0b" }}
                    >
                      Kotak Surat
                    </span>
                    <h3 className="text-3xl font-black text-gradient leading-tight mt-1">
                      Dukungan Aprillivels
                    </h3>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(251,191,36,0.08)",
                      color: "#f59e0b",
                      border: "1px solid rgba(251,191,36,0.2)",
                    }}
                  >
                    💌 {letters.length} Surat
                  </span>
                </div>

                <div className="gradient-divider mt-4 mb-6" />

                {/* Letters Container */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(236,72,153,0.2) transparent"
                  }}
                >
                  {letters.length > 0 ? (
                    letters.map((l) => {
                      const bgMap = {
                        pink: "linear-gradient(145deg, #fff5f7, #fce7f3)",
                        yellow: "linear-gradient(145deg, #fffdf5, #fef3c7)",
                        gradient: "linear-gradient(145deg, #fffbeb 0%, #fdf2f8 50%, #fff1f2 100%)",
                        glass: "rgba(255, 255, 255, 0.75)"
                      };
                      const borderMap = {
                        pink: "rgba(236, 72, 153, 0.15)",
                        yellow: "rgba(251, 191, 36, 0.25)",
                        gradient: "rgba(236, 72, 153, 0.18)",
                        glass: "rgba(236, 72, 153, 0.12)"
                      };
                      return (
                        <motion.article
                          key={l.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 24 }}
                          whileHover={{ y: -3 }}
                          className="rounded-2xl p-5 md:p-6 overflow-hidden flex flex-col justify-between glass-card relative cursor-default group/card"
                          style={{
                            background: bgMap[l.theme],
                            border: `1.5px solid ${borderMap[l.theme]}`,
                            boxShadow: "var(--shadow-card)",
                          }}
                        >
                          {/* Postmark stamp simulation */}
                          <div
                            className="absolute top-4 right-4 w-9 h-9 rounded-full border-2 border-dashed flex items-center justify-center opacity-25 select-none rotate-[15deg] group-hover/card:rotate-[30deg] transition-all duration-300"
                            style={{ borderColor: "#ec4899" }}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest text-pink-600">
                              APRIL
                            </span>
                          </div>

                          <div className="relative z-10">
                            <div className="flex items-center justify-between gap-4 mb-3">
                              <span
                                className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md font-mono"
                                style={{
                                  background: "rgba(236, 72, 153, 0.1)",
                                  color: "#ec4899",
                                }}
                              >
                                {l.type}
                              </span>
                              <span className="text-[9px] font-mono text-gray-400 font-bold">
                                {l.createdAt}
                              </span>
                            </div>

                            <p
                              className="text-xs leading-relaxed font-semibold italic min-h-[64px]"
                              style={{ color: "#4c3247" }}
                            >
                              &ldquo;{l.message}&rdquo;
                            </p>
                          </div>

                          <div className="relative z-10 flex items-center justify-between border-t border-dashed mt-4 pt-3 border-pink-100">
                            <span className="text-[10px] font-black text-gradient flex items-center gap-1">
                              👤 {l.sender}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleLikeLetter(l.id)}
                                type="button"
                                className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-pink-500 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                              >
                                <span>💖</span> {l.likes}
                              </button>
                              <button
                                onClick={() => handleDeleteLetter(l.id)}
                                type="button"
                                className="text-[9px] font-black uppercase tracking-wider text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                                title="Hapus Surat"
                              >
                                <span>🗑</span>
                              </button>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })
                  ) : (
                    <EmptyState
                      className="sm:col-span-2"
                      emoji="📬"
                      title="Kotak Surat Kosong"
                      description="Belum ada surat dukungan. Kirimkan surat pertamamu!"
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
