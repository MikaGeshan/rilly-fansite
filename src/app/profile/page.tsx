"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Loading } from "@/components/ui/loading";
import { CursorSpotlight } from "@/components/ui/cursor-spotlight";
import { FloatingParticles, type Particle } from "@/components/ui/floating-particles";
import { EmptyState } from "@/components/ui/empty-state";
import { useMousePosition } from "@/hooks/use-mouse-position";

interface ShowData {
  title: string;
  date: string;
  start_time: string;
}

const PARTICLES: Particle[] = [
  { id: 1, size: 22, delay: 0, x: "5%", y: "20%", symbol: "🎵" },
  { id: 2, size: 34, delay: 2, x: "90%", y: "15%", symbol: "🌸" },
  { id: 3, size: 26, delay: 4, x: "40%", y: "50%", symbol: "✨" },
  { id: 4, size: 38, delay: 1, x: "85%", y: "70%", symbol: "🎵" },
  { id: 5, size: 28, delay: 3, x: "10%", y: "80%", symbol: "🌟" },
];

export default function ProfilePage() {
  const { mousePos, handleMouseMove } = useMousePosition();
  const [shows, setShows] = useState<ShowData[]>([]);
  const [loadingShows, setLoadingShows] = useState(true);

  useEffect(() => {
    const loadShows = async () => {
      try {
        setLoadingShows(true);
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();
        const res = await fetch(`/api/schedule?month=${month}&year=${year}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setShows(data);
            return;
          }
        }
        throw new Error("Failed to load schedule");
      } catch (error) {
        console.error("Failed to load schedule:", error);
        setShows([]);
      } finally {
        setLoadingShows(false);
      }
    };
    loadShows();
  }, []);

  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);

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

  const profile = {
    fullName: "Bong Aprilli Paskah",
    nickname: "Rilly",
    birthDate: "April 1, 2010",
    birthPlace: "Jakarta, Indonesia",
    height: "166 cm",
    bloodType: "A",
    zodiac: "Aries ♈",
    generation: "13th Generation (Trainee)",
    jikoshoukai:
      "Bagaikan harmoni indah yang berirama di benakmu. Hai, aku Rilly!",
  };

  const funFacts = [
    {
      emoji: "🎤",
      title: "Vokalis Otodidak",
      desc: "Rilly memiliki bakat vokal yang luar biasa merdu dan kuat, yang ia kembangkan sepenuhnya secara otodidak tanpa les vokal formal sebelum bergabung dengan JKT48.",
    },
    {
      emoji: "🔤",
      title: "Inisial 'B' yang Bersejarah",
      desc: "Ia adalah anggota kedua dalam sejarah 13 tahun JKT48 yang namanya diawali huruf 'B', mengikuti jejak anggota generasi pertama legendaris Beby Chaesara Anadila.",
    },
    {
      emoji: "🌟",
      title: "Penampilan Vokal Memukau",
      desc: "Saat JKT48 School 2025, Rilly memukau para penggemar dan staf dengan penampilannya membawakan lagu 'Rapsodi', membuktikan dirinya sebagai salah satu potensi vokal terkuat di generasinya.",
    },
    {
      emoji: "☀️",
      title: "Kepribadian yang Ceria",
      desc: "Dikenal dengan kepercayaan diri yang bersinar dan sikapnya yang periang, Rilly selalu membawa energi positif di setiap penampilan panggung maupun interaksi dengan penggemar.",
    },
  ];

  const quickInfo = [
    { label: "Nama Panggilan", value: profile.nickname },
    { label: "Golongan Darah", value: profile.bloodType },
    { label: "Tanggal Lahir", value: profile.birthDate },
    { label: "Zodiak", value: profile.zodiac },
    { label: "Tinggi Badan", value: profile.height },
    { label: "Usia", value: "16 Tahun" },
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-x-hidden w-full flex flex-col"
      style={{ background: "var(--bg-page)" }}
    >
      {/* ── Cursor spotlight ── */}
      <CursorSpotlight
        mousePos={mousePos}
        blur={55}
        pinkOpacity={0.11}
        yellowOpacity={0.07}
      />

      {/* ── Ambient orbs ── */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: -20 }}
      >
        <div className="orb-pink absolute top-[-8%] right-[-5%] w-[500px] h-[500px] rounded-full" />
        <div className="orb-yellow absolute bottom-[15%] left-[-6%] w-[400px] h-[400px] rounded-full" />
      </div>

      {/* ── Floating emoji particles ── */}
      <FloatingParticles
        particles={PARTICLES}
        opacity={0.1}
        floatY={28}
        floatX={12}
        durationBase={13}
        durationFactor={2.5}
      />

      <Header />

      <main className="flex-grow mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* ─── Page Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left mb-14"
        >
          <span
            className="text-[10px] md:text-xs uppercase tracking-[0.38em] font-black block mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(236,72,153,0.10)",
              color: "#ec4899",
              border: "1px solid rgba(236,72,153,0.22)",
            }}
          >
            🌸 Profil Member
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight shimmer-text mt-4">
            Bong Aprilli Paskah
          </h1>
          <p
            className="mt-3 text-sm md:text-base font-medium"
            style={{ color: "#7b5572" }}
          >
            Kenali perjalanan, bakat, dan fakta unik seputar Rilly JKT48.
          </p>
        </motion.div>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left: Image + Quick Info ── */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Profile Image Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-[2.5rem] aspect-[3/4] shadow-2xl group"
              style={{ boxShadow: "var(--shadow-pink)" }}
            >
              <Image
                src="/rilly_profile.jpg"
                alt="Bong Aprilli JKT48 Profile Portrait"
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 450px"
              />
              {/* Pink-to-yellow gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(236,72,153,0.65) 0%, rgba(251,191,36,0.20) 55%, transparent 100%)",
                }}
              />
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{
                  background: "linear-gradient(90deg, #ec4899, #f59e0b)",
                }}
              />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span
                  className="text-[10px] font-mono tracking-widest px-3 py-1 rounded-full font-bold"
                  style={{
                    background: "rgba(251,191,36,0.28)",
                    color: "#fde68a",
                    border: "1px solid rgba(251,191,36,0.4)",
                  }}
                >
                  GENERATION 13
                </span>
                <h2 className="mt-3 text-3xl font-black tracking-tight drop-shadow-lg">
                  Rilly JKT48
                </h2>
                <p className="text-xs opacity-80 font-medium">
                  Trainee Resmi JKT48
                </p>
              </div>
            </motion.div>

            {/* Quick Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="rounded-3xl p-6 glass-card shadow-lg"
              style={{
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(236,72,153,0.14)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3
                className="text-sm font-black uppercase tracking-wider pb-3 mb-4"
                style={{
                  color: "#b494a9",
                  borderBottom: "1px solid rgba(236,72,153,0.12)",
                }}
              >
                Info Singkat
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {quickInfo.map(({ label, value }) => (
                  <div key={label}>
                    <p
                      className="font-semibold text-xs uppercase tracking-wider"
                      style={{ color: "#b494a9" }}
                    >
                      {label}
                    </p>
                    <p
                      className="font-bold mt-0.5"
                      style={{ color: "#1c0b15" }}
                    >
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Jikoshoukai + Bio + Facts ── */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Jikoshoukai / Quote Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55 }}
              className="relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl"
              style={{
                background:
                  "linear-gradient(135deg, #ec4899 0%, #f59e0b 55%, #fde68a 100%)",
                boxShadow: "0 8px 40px rgba(236,72,153,0.35)",
              }}
            >
              <div
                className="absolute right-6 bottom-4 text-[9rem] font-black leading-none select-none pointer-events-none"
                style={{ color: "rgba(255,255,255,0.12)" }}
              >
                &ldquo;
              </div>
              <span
                className="text-[10px] uppercase tracking-[0.38em] block mb-4 font-black"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                Jikoshoukai (Kalimat Perkenalan)
              </span>
              <p className="text-xl md:text-2xl font-black italic leading-relaxed relative z-10 drop-shadow">
                &ldquo;{profile.jikoshoukai}&rdquo;
              </p>
            </motion.div>

            {/* Biography */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="rounded-[2rem] p-8 shadow-md glass-card"
              style={{
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(236,72,153,0.13)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Section label */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="h-6 w-1 rounded-full"
                  style={{ background: "linear-gradient(#ec4899, #f59e0b)" }}
                />
                <h3 className="font-black text-2xl tracking-tight text-gradient">
                  Biografi
                </h3>
              </div>
              <div
                className="text-sm md:text-base leading-relaxed space-y-4 font-medium"
                style={{ color: "#7b5572" }}
              >
                <p>
                  Lahir di Jakarta pada 1 April 2010,{" "}
                  <strong style={{ color: "#ec4899" }}>
                    Bong Aprilli Paskah
                  </strong>
                  , yang akrab disapa{" "}
                  <strong style={{ color: "#ec4899" }}>Rilly</strong>, resmi
                  terjun ke dunia hiburan sebagai anggota Generasi 13 Trainee
                  JKT48 pada akhir 2024. Meski masih muda, ia sudah berhasil
                  mencuri hati banyak orang dengan suara nyanyian alami yang
                  kuat dan pesona panggung yang memukau.
                </p>
                <p>
                  Kehadiran Rilly di JKT48 membawa angin segar bagi generasi
                  baru. Memilih nama panggilan &ldquo;Rilly&rdquo; dari nama
                  tengahnya, ia berdedikasi penuh mengembangkan kemampuannya di
                  akademi Trainee JKT48, berjuang setiap hari di penampilan
                  teater demi meraih promosi sebagai member penuh.
                </p>
              </div>
            </motion.section>

            {/* Fun Facts */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="rounded-[2rem] p-8 shadow-md glass-card"
              style={{
                background: "rgba(255,255,255,0.82)",
                border: "1px solid rgba(251,191,36,0.15)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="h-6 w-1 rounded-full"
                  style={{ background: "linear-gradient(#f59e0b, #ec4899)" }}
                />
                <h3 className="font-black text-2xl tracking-tight text-gradient">
                  Fakta Menarik
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {funFacts.map((fact, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className="p-5 rounded-2xl relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,251,235,0.85) 0%, rgba(253,242,248,0.85) 100%)",
                      border: "1px solid rgba(236,72,153,0.12)",
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
                      style={{
                        background: "linear-gradient(90deg, #ec4899, #f59e0b)",
                      }}
                    />
                    <span className="text-2xl block mb-2">{fact.emoji}</span>
                    <h4
                      className="font-bold text-base mb-2"
                      style={{ color: "#1c0b15" }}
                    >
                      {fact.title}
                    </h4>
                    <p
                      className="text-xs md:text-sm leading-relaxed font-medium"
                      style={{ color: "#7b5572" }}
                    >
                      {fact.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* ─── Theater Schedule Section ─── */}
        <motion.section
          id="theater"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-20 relative z-10"
        >
          <div
            className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 gap-4"
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
                Jadwal Theater
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
              🎭 Bulan Ini
            </span>
          </div>

          <div>
            {loadingShows ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loading variant="dots" size="md" label="Please Wait ..." />
              </div>
            ) : shows.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {shows.map((show, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="rounded-3xl p-6 glass-card cursor-default"
                    style={{
                      background: "rgba(255,255,255,0.80)",
                      boxShadow: "var(--shadow-card)",
                      border: "1px solid rgba(236,72,153,0.12)",
                    }}
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
                      className="mt-4 flex items-center justify-between text-[10px] font-mono font-bold"
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
              <EmptyState
                emoji="🎭"
                title="To Be Announced"
                description="Jadwal belum tersedia untuk bulan ini."
              />
            )}
          </div>
        </motion.section>

        {/* ════════════════════════════════════
            HASHTAG GUIDE
        ════════════════════════════════════ */}
        <section id="hashtag-guide" className="relative mt-20 pb-8 overflow-hidden">
          {/* Divider line */}
          <div className="gradient-divider mb-12" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10"
          >
            <div className="max-w-3xl">
              <p
                className="text-[9px] uppercase tracking-[0.38em] font-bold mb-2"
                style={{ color: "#f59e0b" }}
              >
                Community Tags
              </p>
              <h2 className="text-4xl md:text-5xl font-black leading-none text-gradient">
                Hashtag Guide
              </h2>
              <p className="text-sm md:text-base leading-relaxed max-w-2xl mt-4 font-medium" style={{ color: "#7b5572" }}>
                Hashtag resmi untuk meramaikan konten dan interaksi bersama Rilly.
                Gunakan hashtag ini untuk berbagi momen dan dukungan tentang perjalanan Bong Aprilli di JKT48.
              </p>
            </div>
            <div
              className="rounded-2xl px-6 py-4 glass-card shadow-sm"
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
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="relative rounded-2xl p-6 overflow-hidden flex flex-col justify-between glass-card group/htag cursor-default"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.85) 0%, rgba(253,242,248,0.85) 100%)",
                  border: "1px solid rgba(236,72,153,0.14)",
                  boxShadow: "var(--shadow-card)",
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
                    <div className="flex items-start justify-between gap-4 mb-4">
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
                    <h3 className="font-bold text-2xl tracking-tight mb-2 text-gradient">
                      {h.tag}
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#7b5572" }}>
                      {h.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyHashtag(h.tag)}
                    type="button"
                    id={`copy-hashtag-${index}`}
                    className="mt-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] transition-all duration-200 hover:gap-3 cursor-pointer"
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
