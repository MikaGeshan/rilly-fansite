"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  link: string;
  date: string;
}

interface SupabaseMediaRow {
  payload?: string | null;
  link?: string | null;
  date?: string | null;
  shortcode?: string | null;
}

interface GalleryState {
  activeItem: GalleryItem | null;
  items: GalleryItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  page: number;
  error: string | null;
  setActiveItem: (item: GalleryItem | null) => void;
  loadPage: (pageNum: number, isInitial?: boolean) => Promise<void>;
  loadNextPage: () => Promise<void>;
  retryCurrentPage: () => Promise<void>;
}

const PAGE_SIZE = 12;

function formatGalleryDate(date?: string | null) {
  return date
    ? new Date(date).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Tanggal tidak diketahui";
}

function toGalleryItem(item: SupabaseMediaRow, index: number): GalleryItem {
  return {
    id: `${item.shortcode || "scraped"}-${index}`,
    src: item.payload || "",
    alt: "Media Bong Aprilli JKT48",
    link: item.link || "",
    date: formatGalleryDate(item.date),
  };
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  activeItem: null,
  items: [],
  loading: true,
  loadingMore: false,
  hasMore: true,
  page: 1,
  error: null,
  setActiveItem: (activeItem) => set({ activeItem }),
  loadPage: async (pageNum, isInitial = false) => {
    try {
      if (isInitial) set({ loading: true, page: 1 });
      else set({ loadingMore: true });
      set({ error: null });

      const fromRange = (pageNum - 1) * PAGE_SIZE;
      const toRange = pageNum * PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from("media")
        .select("payload, link, date, shortcode")
        .order("date", { ascending: false })
        .range(fromRange, toRange);

      if (error) throw error;

      const rows = Array.isArray(data) ? (data as SupabaseMediaRow[]) : [];
      const nextItems = rows.map((item, idx) =>
        toGalleryItem(item, fromRange + idx),
      );

      set((state) => ({
        items: isInitial ? nextItems : [...state.items, ...nextItems],
        hasMore: rows.length === PAGE_SIZE,
        page: pageNum,
      }));
    } catch (err) {
      console.warn("Could not load dynamic scraped media from Supabase:", err);
      set((state) => ({
        error: "Gagal memuat galeri. Silakan coba lagi.",
        items: isInitial ? [] : state.items,
      }));
    } finally {
      set({ loading: false, loadingMore: false });
    }
  },
  loadNextPage: async () => {
    const nextPage = get().page + 1;
    await get().loadPage(nextPage, false);
  },
  retryCurrentPage: async () => {
    const { page, items } = get();
    await get().loadPage(page, items.length === 0);
  },
}));
