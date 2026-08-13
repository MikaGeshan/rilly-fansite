"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Loading } from "@/components/ui/loading";
import { useProfileStore } from "@/stores/profile-store";

const profile = {
  fullName: "Bong Aprilli Paskah",
  nickname: "Rilly",
  birthDate: "April 1, 2010",
  birthPlace: "Jakarta, Indonesia",
  height: "166 cm",
  bloodType: "A",
  zodiac: "Aries",
  generation: "13th Generation Trainee",
  jikoshoukai:
    "Bagaikan harmoni indah yang berirama di benakmu. Hai, aku Rilly!",
};

const quickInfo = [
  ["Nama Panggilan", profile.nickname],
  ["Golongan Darah", profile.bloodType],
  ["Tanggal Lahir", profile.birthDate],
  ["Zodiak", profile.zodiac],
  ["Tinggi", profile.height],
  ["Domisili", profile.birthPlace],
];

const profileMetrics = [
  ["Generation", "13th"],
  ["Role", "Trainee"],
  ["Height", profile.height],
];

const socialLinks = [
  {
    name: "Instagram",
    handle: "@rilly.jkt48_",
    href: "https://www.instagram.com/rilly.jkt48_/?hl=en",
    iconSrc: "/instagram.png",
  },
  {
    name: "X",
    handle: "@Rilly_JKT48",
    href: "https://x.com/Rilly_JKT48",
    iconSrc: "/x.png",
  },
  {
    name: "TikTok",
    handle: "@jkt48.rilly",
    href: "https://www.tiktok.com/@jkt48.rilly",
    iconSrc: "/tik-tok.png",
  },
  {
    name: "SHOWROOM",
    handle: "JKT48_Rilly",
    href: "https://www.showroom-live.com/r/JKT48_Rilly",
    iconSrc: "/showroom-live.png",
  },
  {
    name: "IDN",
    handle: "jkt48_rilly",
    href: "https://www.idn.app/jkt48_rilly",
    iconSrc: "/IDN.png",
  },
];

const hashtags: [tag: string, title: string][] = [
  ["#MornRill", "Setiap Pagi"],
  ["#NightRill", "Sebelum Tidur"],
  ["#fRillday", "Setiap Jumat"],
  ["#NgabubuRill", "Sebelum Berbuka Puasa"],
  ["#InRilLive", "Live Streaming"],
  ["#RillCall", "Video Call"],
  ["#CoveRill", "Singing Covers"],
  ["#HaRillybur", "Liburan"],
];

function SparkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
    >
      <path
        d="M12 3.5l1.92 5.03L19 10.45l-5.08 1.92L12 17.5l-1.92-5.13L5 10.45l5.08-1.92L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M18 15.5l.82 2.05L21 18.4l-2.18.82L18 21.5l-.82-2.28L15 18.4l2.18-.85L18 15.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProfilePortraitShowcase() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.58 }}
      className="relative mx-auto w-full max-w-[620px] lg:mx-0"
    >
      <div className="absolute -left-3 top-10 h-28 w-28 rounded-lg bg-[var(--yellow)]/45 blur-2xl" />
      <div className="absolute -right-4 bottom-18 h-32 w-32 rounded-lg bg-[var(--pink)]/28 blur-2xl" />

      <motion.div
        whileHover={shouldReduceMotion ? undefined : { y: -6, rotate: -0.6 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative rounded-lg border border-white/80 bg-white/78 p-3 shadow-[0_28px_90px_rgba(190,24,93,0.18)] backdrop-blur-xl"
      >
        <div className="absolute inset-3 rounded-lg bg-[linear-gradient(135deg,rgba(244,63,143,0.2),rgba(255,216,77,0.36),rgba(255,255,255,0.32))]" />
        <div className="relative grid gap-3 lg:grid-cols-[1fr_0.34fr]">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-[var(--ink)] sm:min-h-[620px] lg:min-h-[650px]">
            <Image
              src="/rilly_profile.jpg"
              alt="Bong Aprilli Paskah atau Rilly JKT48 dalam foto profil"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 520px"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(36,19,28,0)_38%,rgba(36,19,28,0.76)_100%),linear-gradient(90deg,rgba(190,24,93,0.2),rgba(244,169,0,0.16))]" />
            <div className="absolute left-5 right-5 top-5 flex items-center justify-between gap-3">
              <span className="rounded-lg border border-white/24 bg-white/16 px-3 py-2 text-xs font-black uppercase text-white backdrop-blur-md">
                Official Profile
              </span>
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-white/24 bg-white/16 text-yellow-100 backdrop-blur-md">
                <SparkIcon className="h-5 w-5" />
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-7">
              <p className="text-xs font-black uppercase text-yellow-100">
                {profile.generation}
              </p>
              <h1 className="mt-2 text-5xl font-black tracking-tight sm:text-7xl">
                Rilly
              </h1>
              <p className="mt-2 text-sm font-semibold text-white/80">
                {profile.fullName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {profileMetrics.map(([label, value], index) => (
              <div
                key={label}
                className="rounded-lg border border-[var(--line)] bg-white/82 p-4 shadow-sm"
              >
                <p className="text-[10px] font-black uppercase text-[var(--soft)]">
                  {label}
                </p>
                <p className="mt-2 text-lg font-black text-[var(--ink)] sm:text-xl">
                  {value}
                </p>
                <div
                  className="mt-4 h-1.5 rounded-full"
                  style={{
                    background:
                      index % 2 === 0
                        ? "linear-gradient(90deg, var(--pink), var(--yellow))"
                        : "linear-gradient(90deg, var(--yellow), var(--pink))",
                  }}
                />
              </div>
            ))}
            <div className="relative hidden overflow-hidden rounded-lg border border-white/80 bg-white/80 p-1 shadow-sm lg:block">
              <div className="relative h-40 overflow-hidden rounded-lg">
                <Image
                  src="/rilly_profile.jpg"
                  alt=""
                  fill
                  className="object-cover object-top"
                  sizes="180px"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.46, delay: 0.16 }}
        className="glass-panel relative z-10 mx-4 -mt-8 p-5 sm:mx-8"
      >
        <p className="text-xs font-black uppercase text-[var(--pink-deep)]">
          Jikoshoukai
        </p>
        <blockquote className="mt-2 text-lg font-black leading-snug text-[var(--ink)] sm:text-xl">
          &ldquo;{profile.jikoshoukai}&rdquo;
        </blockquote>
      </motion.div>
    </motion.div>
  );
}

export default function ProfilePage() {
  const shows = useProfileStore((state) => state.shows);
  const loadingShows = useProfileStore((state) => state.loadingShows);
  const copiedHashtag = useProfileStore((state) => state.copiedHashtag);
  const loadShows = useProfileStore((state) => state.loadShows);
  const copyHashtag = useProfileStore((state) => state.copyHashtag);

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-grow px-4 pt-14 sm:px-6 lg:px-8">
        <section className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <ProfilePortraitShowcase />

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.08 }}
          >
            <span className="eyebrow">Profil Member</span>
            <h2 className="mt-5 text-5xl font-black leading-tight tracking-tight text-gradient sm:text-6xl">
              Bong Aprilli Paskah
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {quickInfo.map(([label, value]) => (
                <div key={label} className="glass-panel p-4">
                  <p className="text-[10px] font-black uppercase text-[var(--soft)]">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-black text-[var(--ink)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase text-[var(--pink-deep)]">
                  Official Socials
                </p>
                <p className="btn-muted px-3 py-2 text-xs">5 Platforms</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open Rilly ${social.name}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + index * 0.04 }}
                    whileHover={{ y: -3 }}
                    className="glass-panel group flex items-center gap-3 p-3 transition duration-200 hover:shadow-[0_18px_48px_rgba(190,24,93,0.16)]"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-white/76 shadow-sm ring-1 ring-pink-100">
                      <Image
                        src={social.iconSrc}
                        alt=""
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-[var(--ink)]">
                        {social.name}
                      </span>
                      <span className="block truncate text-xs font-semibold text-[var(--muted)]">
                        {social.handle}
                      </span>
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="theater" className="mt-18 scroll-mt-24">
          <div className="section-rule mb-10" />
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">Stage Performance</span>
              <h2 className="mt-4 text-4xl font-black text-gradient">
                Jadwal Theater
              </h2>
            </div>
            <p className="btn-muted px-3 py-2 text-xs">
              {loadingShows ? "Memuat Show" : `${shows.length} Show Bulan Ini`}
            </p>
          </div>

          {loadingShows ? (
            <div className="flex justify-center py-16">
              <Loading variant="dots" size="md" label="Please Wait ..." />
            </div>
          ) : shows.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shows.map((show, index) => (
                <article
                  key={`${show.title}-${index}`}
                  className="glass-panel p-5"
                >
                  <p className="text-xs font-black uppercase text-[var(--pink-deep)]">
                    Show #{String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-xl font-black leading-tight text-[var(--ink)]">
                    {show.title}
                  </h3>
                  <div className="mt-5 flex items-center justify-between gap-3 text-xs font-black text-[var(--muted)]">
                    <span>{show.date}</span>
                    <span className="rounded-lg bg-yellow-100 px-2 py-1 text-[var(--pink-deep)]">
                      {show.start_time} WIB
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="glass-panel p-10 text-center">
              <h3 className="text-xl font-black text-gradient">
                To Be Announced
              </h3>
              <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                Jadwal belum tersedia untuk bulan ini.
              </p>
            </div>
          )}
        </section>

        <section className="mt-18 pb-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">Community Tags</span>
              <h2 className="mt-4 text-4xl font-black text-gradient">
                Hashtag Guide
              </h2>
            </div>
            <p className="btn-muted px-3 py-2 text-xs">8 Tags</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {hashtags.map(([tag, title], index) => (
              <article key={tag} className="glass-panel p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-black uppercase text-[var(--soft)]">
                    {title}
                  </p>
                  <span className="text-xs font-black text-[var(--pink-deep)]">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-black text-gradient">
                  {tag}
                </h3>
                <button
                  type="button"
                  onClick={() => copyHashtag(tag)}
                  className="mt-5 text-xs font-black uppercase text-[var(--pink-deep)]"
                >
                  {copiedHashtag === tag ? "Copied" : "Copy Tag"}
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
