"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { CursorSpotlight } from "@/components/ui/cursor-spotlight";
import {
  FloatingParticles,
  type Particle,
} from "@/components/ui/floating-particles";
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
    message:
      "Rilly, semangat terus ya jalani hari-hari sebagai Trainee JKT48! Bakat menyanyi kamu luar biasa merdu, kami semua di sini akan selalu mendukungmu sampai jadi member reguler!",
    theme: "pink",
    createdAt: "11 Juli 2026",
    likes: 12,
  },
  {
    id: "2",
    sender: "Indah Wahyuni",
    type: "Penyemangat",
    message:
      "Suara kamu pas bawain Rapsodi di JKT48 School keren banget. Harmoni indah yang selalu berirama di benakku, seperti jikoshoukai-mu!",
    theme: "yellow",
    createdAt: "10 Juli 2026",
    likes: 8,
  },
  {
    id: "3",
    sender: "Dwi Nugroho",
    type: "Harapan",
    message:
      "Semoga Rilly selalu diberikan kesehatan dan kelancaran dalam setiap show teater JKT48. Tetap bersinar dan nikmati prosesnya.",
    theme: "gradient",
    createdAt: "09 Juli 2026",
    likes: 15,
  },
];

const themeStyles: Record<FanLetter["theme"], string> = {
  pink: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,226,241,0.92))",
  yellow:
    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,244,190,0.9))",
  gradient:
    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,232,244,0.9) 48%, rgba(255,246,205,0.92))",
  glass: "rgba(255,255,255,0.78)",
};

export default function Home() {
  const [letters, setLetters] = useState<FanLetter[]>([]);
  const [sender, setSender] = useState("");
  const [type, setType] = useState<FanLetter["type"]>("Dukungan");
  const [message, setMessage] = useState("");
  const [themeOption, setThemeOption] = useState<FanLetter["theme"]>("pink");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("rilly_fan_letters");
    if (!saved) {
      localStorage.setItem(
        "rilly_fan_letters",
        JSON.stringify(DEFAULT_LETTERS),
      );
      queueMicrotask(() => setLetters(DEFAULT_LETTERS));
      return;
    }

    try {
      const parsedLetters = JSON.parse(saved);
      queueMicrotask(() => setLetters(parsedLetters));
    } catch {
      queueMicrotask(() => setLetters(DEFAULT_LETTERS));
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
      createdAt: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      likes: 0,
    };

    const updated = [newLetter, ...letters];
    setLetters(updated);
    localStorage.setItem("rilly_fan_letters", JSON.stringify(updated));
    setSender("");
    setMessage("");
    setThemeOption("pink");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2600);
  };

  const updateLetters = (next: FanLetter[]) => {
    setLetters(next);
    localStorage.setItem("rilly_fan_letters", JSON.stringify(next));
  };

  return (
    <div className="site-shell">
      <Header />

      <main>
        <section className="relative -mt-21 min-h-[calc(100vh-1rem)] overflow-hidden">
          <Image
            src="/rilly_stage.png"
            alt="Rilly JKT48 Stage Performance"
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(36,19,28,0.86),rgba(36,19,28,0.46)_48%,rgba(255,244,190,0.22)),linear-gradient(180deg,rgba(36,19,28,0.25),rgba(255,253,247,0.98)_92%)]" />

          <div className="relative z-10 mx-auto flex min-h-[calc(100vh-1rem)] max-w-7xl items-center px-4 pb-20 pt-36 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="max-w-3xl text-white"
            >
              <span className="eyebrow border-white/20 bg-white/14 text-white backdrop-blur">
                Official Fanbase
              </span>
              <h1 className="mt-6 text-6xl font-black leading-[0.9] tracking-tight sm:text-7xl lg:text-8xl">
                Aprillivels
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/84 sm:text-lg">
                Rumah dukungan untuk Rilly JKT48. Fresh, hangat, dan penuh
                energi untuk merayakan tiap langkah Bong Aprilli Paskah di
                panggung.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/profile"
                  className="btn-gradient px-6 py-3 text-sm"
                >
                  Meet Rilly
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/28 bg-white/12 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:bg-white/20"
                >
                  View Gallery
                </Link>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["13th", "Generation"],
                  ["Trainee", "JKT48"],
                  ["Aprillivels", "Fanbase"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-white/18 bg-white/12 p-4 backdrop-blur"
                  >
                    <p className="text-lg font-black">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-white/62">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="section-rule mb-12" />
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-panel p-5 sm:p-7"
            >
              <span className="eyebrow">Write To Rilly</span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-gradient">
                Fan Letter
              </h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[var(--muted)]">
                Kirim dukungan singkat yang terasa personal. Surat tersimpan
                lokal di browser ini, jadi fans bisa ikut menjaga suasana
                positif.
              </p>

              <form onSubmit={handleSubmitLetter} className="mt-7 grid gap-4">
                <label className="grid gap-2 text-xs font-black uppercase text-[var(--soft)]">
                  Nama Pengirim
                  <input
                    className="field px-4 py-3 text-sm font-semibold normal-case"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    placeholder="Nama atau pseudonim"
                    required
                    maxLength={40}
                  />
                </label>
                <label className="grid gap-2 text-xs font-black uppercase text-[var(--soft)]">
                  Jenis Surat
                  <select
                    className="field px-4 py-3 text-sm font-semibold normal-case"
                    value={type}
                    onChange={(e) =>
                      setType(e.target.value as FanLetter["type"])
                    }
                  >
                    <option value="Dukungan">Dukungan</option>
                    <option value="Penyemangat">Penyemangat</option>
                    <option value="Harapan">Harapan</option>
                    <option value="Salam Panggung">Salam Panggung</option>
                  </select>
                </label>
                <label className="grid gap-2 text-xs font-black uppercase text-[var(--soft)]">
                  Isi Pesan
                  <textarea
                    className="field min-h-32 resize-none px-4 py-3 text-sm font-semibold normal-case leading-6"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tulis dukunganmu di sini..."
                    required
                    maxLength={500}
                  />
                </label>
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-[var(--soft)]">
                    Tone Kartu
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(["pink", "yellow", "gradient", "glass"] as const).map(
                      (opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setThemeOption(opt)}
                          className="h-9 rounded-lg border px-3 text-xs font-black capitalize"
                          style={{
                            background: themeStyles[opt],
                            borderColor:
                              themeOption === opt
                                ? "rgba(190,24,93,0.64)"
                                : "rgba(190,24,93,0.14)",
                            color:
                              themeOption === opt
                                ? "var(--pink-deep)"
                                : "var(--muted)",
                          }}
                        >
                          {opt}
                        </button>
                      ),
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-gradient w-full px-5 py-3 text-sm"
                >
                  Kirim Surat Dukungan
                </button>
                {submitted && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm font-black text-emerald-600"
                  >
                    Surat berhasil terkirim ke kotak surat.
                  </motion.p>
                )}
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="min-w-0"
            >
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="eyebrow">Kotak Surat</span>
                  <h3 className="mt-3 text-4xl font-black text-gradient">
                    Dukungan Aprillivels
                  </h3>
                </div>
                <p className="btn-muted px-3 py-2 text-xs">
                  {letters.length} Surat
                </p>
              </div>
              <div className="grid max-h-[640px] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
                {letters.length > 0 ? (
                  letters.map((letter) => (
                    <motion.article
                      key={letter.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      className="glass-panel flex min-h-58 flex-col justify-between p-5"
                      style={{ background: themeStyles[letter.theme] }}
                    >
                      <div>
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <span className="rounded-lg bg-white/70 px-2 py-1 text-[10px] font-black uppercase text-[var(--pink-deep)]">
                            {letter.type}
                          </span>
                          <span className="text-right text-[10px] font-bold text-[var(--soft)]">
                            {letter.createdAt}
                          </span>
                        </div>
                        <p className="text-sm font-semibold leading-7 text-[var(--ink)]">
                          &ldquo;{letter.message}&rdquo;
                        </p>
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-dashed border-pink-200 pt-4">
                        <p className="min-w-0 truncate text-sm font-black text-gradient">
                          {letter.sender}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateLetters(
                                letters.map((item) =>
                                  item.id === letter.id
                                    ? { ...item, likes: item.likes + 1 }
                                    : item,
                                ),
                              )
                            }
                            className="btn-muted px-2 py-1 text-xs"
                          >
                            Love {letter.likes}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateLetters(
                                letters.filter((item) => item.id !== letter.id),
                              )
                            }
                            className="rounded-lg px-2 py-1 text-xs font-black text-[var(--soft)] hover:bg-red-50 hover:text-red-600"
                            title="Hapus Surat"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  ))
                ) : (
                  <div className="glass-panel p-10 text-center sm:col-span-2">
                    <h4 className="text-lg font-black text-gradient">
                      Kotak Surat Kosong
                    </h4>
                    <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                      Belum ada surat dukungan. Kirimkan surat pertamamu.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
