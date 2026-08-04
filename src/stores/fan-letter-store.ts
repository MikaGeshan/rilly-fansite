"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface FanLetter {
  id: string;
  sender: string;
  type: "Dukungan" | "Penyemangat" | "Harapan" | "Salam Panggung";
  message: string;
  theme: "pink" | "yellow" | "gradient" | "glass";
  createdAt: string;
  likes: number;
}

export const DEFAULT_LETTERS: FanLetter[] = [
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

interface FanLetterState {
  letters: FanLetter[];
  sender: string;
  type: FanLetter["type"];
  message: string;
  themeOption: FanLetter["theme"];
  submitted: boolean;
  setSender: (sender: string) => void;
  setType: (type: FanLetter["type"]) => void;
  setMessage: (message: string) => void;
  setThemeOption: (themeOption: FanLetter["theme"]) => void;
  submitLetter: () => boolean;
  likeLetter: (id: string) => void;
  deleteLetter: (id: string) => void;
  dismissSubmitted: () => void;
}

let submittedTimer: ReturnType<typeof setTimeout> | undefined;

export const useFanLetterStore = create<FanLetterState>()(
  persist(
    (set, get) => ({
      letters: DEFAULT_LETTERS,
      sender: "",
      type: "Dukungan",
      message: "",
      themeOption: "pink",
      submitted: false,
      setSender: (sender) => set({ sender }),
      setType: (type) => set({ type }),
      setMessage: (message) => set({ message }),
      setThemeOption: (themeOption) => set({ themeOption }),
      submitLetter: () => {
        const { sender, type, message, themeOption, letters } = get();
        if (!sender.trim() || !message.trim()) return false;

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

        set({
          letters: [newLetter, ...letters],
          sender: "",
          message: "",
          themeOption: "pink",
          submitted: true,
        });

        if (submittedTimer) clearTimeout(submittedTimer);
        submittedTimer = setTimeout(() => set({ submitted: false }), 2600);

        return true;
      },
      likeLetter: (id) =>
        set((state) => ({
          letters: state.letters.map((letter) =>
            letter.id === id
              ? { ...letter, likes: letter.likes + 1 }
              : letter,
          ),
        })),
      deleteLetter: (id) =>
        set((state) => ({
          letters: state.letters.filter((letter) => letter.id !== id),
        })),
      dismissSubmitted: () => set({ submitted: false }),
    }),
    {
      name: "rilly-fan-letter-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ letters: state.letters }),
    },
  ),
);
