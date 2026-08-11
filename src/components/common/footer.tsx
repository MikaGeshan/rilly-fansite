import React from "react";
import Image from "next/image";

export function Footer() {
  const socials = [
    {
      href: "https://instagram.com/rilly.jkt48_",
      label: "Instagram",
      src: "/instagram.png",
    },
    { href: "https://x.com/Rilly_JKT48", label: "X", src: "/x.png" },
    {
      href: "https://tiktok.com/@jkt48.rilly",
      label: "TikTok",
      src: "/tik-tok.png",
    },
  ];

  return (
    <footer className="relative mt-28 overflow-hidden bg-transparent">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-3xl font-black text-gradient">Aprillivels</p>
          <p className="mt-2 max-w-xl text-sm font-semibold text-[var(--muted)]">
            Ruang dukungan yang hangat, rapi, dan penuh energi untuk perjalanan
            Bong Aprilli Paskah di JKT48.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="grid h-11 w-11 place-items-center rounded-lg border border-pink-200/70 bg-white/58 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:bg-white/78 hover:shadow-md"
            >
              <Image
                src={social.src}
                alt=""
                width={22}
                height={22}
                className="object-contain"
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
