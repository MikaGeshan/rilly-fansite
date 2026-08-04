"use client";

import { create } from "zustand";

export interface ShowData {
  title: string;
  date: string;
  start_time: string;
}

interface ProfileState {
  shows: ShowData[];
  loadingShows: boolean;
  copiedHashtag: string | null;
  loadShows: () => Promise<void>;
  copyHashtag: (tag: string) => void;
}

let copiedTimer: ReturnType<typeof setTimeout> | undefined;

export const useProfileStore = create<ProfileState>((set) => ({
  shows: [],
  loadingShows: true,
  copiedHashtag: null,
  loadShows: async () => {
    set({ loadingShows: true });

    try {
      const now = new Date();
      const res = await fetch(
        `/api/schedule?month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
      );
      if (!res.ok) throw new Error("Failed to load schedule");

      const data = await res.json();
      set({ shows: Array.isArray(data) ? data : [] });
    } catch {
      set({ shows: [] });
    } finally {
      set({ loadingShows: false });
    }
  },
  copyHashtag: (tag) => {
    navigator.clipboard.writeText(tag);
    set({ copiedHashtag: tag });

    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => set({ copiedHashtag: null }), 1800);
  },
}));
