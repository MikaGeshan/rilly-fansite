"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { type FanLetter, useFanLetterStore } from "@/stores/fan-letter-store";
import { ImageFrame } from "@/components/ui/image-frame";

const themeStyles: Record<FanLetter["theme"], string> = {
  pink: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,226,241,0.92))",
  yellow:
    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,244,190,0.9))",
  gradient:
    "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,232,244,0.9) 48%, rgba(255,246,205,0.92))",
  glass: "rgba(255,255,255,0.78)",
};

export default function Home() {
  const letters = useFanLetterStore((state) => state.letters);
  const sender = useFanLetterStore((state) => state.sender);
  const type = useFanLetterStore((state) => state.type);
  const message = useFanLetterStore((state) => state.message);
  const themeOption = useFanLetterStore((state) => state.themeOption);
  const submitted = useFanLetterStore((state) => state.submitted);
  const setSender = useFanLetterStore((state) => state.setSender);
  const setType = useFanLetterStore((state) => state.setType);
  const setMessage = useFanLetterStore((state) => state.setMessage);
  const setThemeOption = useFanLetterStore((state) => state.setThemeOption);
  const submitLetter = useFanLetterStore((state) => state.submitLetter);
  const likeLetter = useFanLetterStore((state) => state.likeLetter);
  const deleteLetter = useFanLetterStore((state) => state.deleteLetter);

  const handleSubmitLetter = (e: React.FormEvent) => {
    e.preventDefault();
    submitLetter();
  };

  return (
    <div className="site-shell">
      <Header />
      <main className="relative overflow-hidden">
        {/* Welcome Section */}
        <section className="relative -mt-20 min-h-[calc(100vh-1rem)] overflow-hidden">
          <div className="relative z-10 mx-auto grid min-h-[calc(100vh-1rem)] max-w-7xl items-center gap-12 px-4 pb-8 pt-36 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="max-w-3xl text-[var(--ink)]"
            >
              <span className="inline-flex rounded-full bg-white/68 px-4 py-2 text-xs font-black uppercase text-[var(--pink-deep)] shadow-sm backdrop-blur">
                Official Fanbase
              </span>
              <h1 className="mt-6 text-6xl font-black leading-[0.9] tracking-tight text-gradient sm:text-7xl lg:text-8xl">
                Aprillivels
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-[var(--muted)] sm:text-lg">
                Rumah dukungan untuk Rilly JKT48. Tempat Aprillivels berkumpul,
                berbagi semangat, dan merayakan perjalanan Bong Aprilli Paskah.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/profile"
                  className="btn-gradient rounded-full px-6 py-3 text-sm"
                >
                  Lihat Profil Rilly
                </Link>
              </div>
              <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
                {[
                  ["13th", "Generation"],
                  ["JKT48", "Trainee"],
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-lg bg-white/58 p-4 shadow-sm backdrop-blur"
                  >
                    <p className="text-lg font-black">{value}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-[var(--soft)]">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 36, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative mx-auto w-full max-w-[560px] lg:mx-0"
            >
              <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(244,63,143,0.22),transparent_64%)] blur-2xl" />
              <div className="relative overflow-hidden rounded-lg bg-white/52 p-4 shadow-[0_30px_90px_rgba(190,24,93,0.16)] backdrop-blur-xl">
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.78),rgba(255,216,77,0.18),rgba(244,63,143,0.14))]" />
                <div className="relative min-h-[430px] overflow-hidden rounded-lg bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,240,248,0.72))] sm:min-h-[560px]">
                  <div className="absolute inset-x-8 bottom-8 h-20 rounded-full bg-[radial-gradient(ellipse,rgba(190,24,93,0.24),transparent_68%)] blur-xl" />
                  <motion.div
                    initial={{ opacity: 0, y: 44, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.78,
                      delay: 0.38,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="absolute inset-x-0 bottom-0 mx-auto flex justify-center px-8 pt-10"
                  >
                    <ImageFrame
                      src="/main_page.jpeg"
                      alt="Rilly JKT48"
                      caption="Bong Aprilli"
                      stampText="13th Generation "
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="relative overflow-hidden px-4 pb-20 pt-0 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(ellipse_at_center,rgba(255,244,202,0.42),transparent_70%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
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
                      <div className="mt-5 flex items-center justify-between pt-4">
                        <p className="min-w-0 truncate text-sm font-black text-gradient">
                          {letter.sender}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => likeLetter(letter.id)}
                            className="btn-muted px-2 py-1 text-xs"
                          >
                            Love {letter.likes}
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteLetter(letter.id)}
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
