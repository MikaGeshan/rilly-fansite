import { NextResponse } from "next/server";
import { ghostFetch } from "ghostfetch";

const BASE_URL = "https://jkt48.com/api/v1";
const MEMBER_ID = 39;
const CACHE_TTL_MS = 5 * 60 * 1000;
const DETAIL_CONCURRENCY = 5;

interface Member {
  name: string;
  type: string;
  member_id: number;
}

interface ShowData {
  code: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  jkt48_member: Member[];
  jkt48_member_type: string;
  default_price: number;
  total_quota: number;
  reference_code?: string;
}

interface ScheduleResult {
  source: string;
  month: string;
  year: string;
  member_id: number;
  count: number;
  shows: ShowData[];
}

interface ApiEnvelope<T> {
  data?: T;
}

interface CacheEntry {
  expiresAt: number;
  result: ScheduleResult;
}

const scheduleCache = new Map<string, CacheEntry>();
const pendingRequests = new Map<string, Promise<ScheduleResult>>();

export function clearScheduleRouteCache() {
  scheduleCache.clear();
  pendingRequests.clear();
}

function cacheKey(month: string, year: string) {
  return `${year}-${month}`;
}

function isTargetMemberShow(show: Pick<ShowData, "jkt48_member">) {
  return show.jkt48_member.some((member) => member.member_id === MEMBER_ID);
}

function normalizeMonthYear(month: string | null, year: string | null) {
  const now = new Date();
  const parsedMonth = Number(month);
  const parsedYear = Number(year);

  return {
    month:
      Number.isInteger(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
        ? String(parsedMonth)
        : String(now.getMonth() + 1),
    year:
      Number.isInteger(parsedYear) && parsedYear >= 2000 && parsedYear <= 2100
        ? String(parsedYear)
        : String(now.getFullYear()),
  };
}

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const response = await ghostFetch(url, {
    browser: "Chrome_131",
  });

  if (response.status !== 200) {
    if (response.status === 403) {
      throw new Error(`Cloudflare blocked the request to ${path}. Status: 403`);
    }
    throw new Error(`API error ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(items[currentIndex]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );

  return results;
}

async function fetchOfficialSchedule(
  month: string,
  year: string,
): Promise<ScheduleResult> {
  const schedulesResponse = await fetchJson<ApiEnvelope<ShowData[]>>(
    `/schedules?lang=id&month=${month}&year=${year}&type=show`,
  );
  const schedules = Array.isArray(schedulesResponse.data)
    ? schedulesResponse.data
    : [];

  const listMatches = schedules.filter((show) => {
    return Array.isArray(show.jkt48_member) && isTargetMemberShow(show);
  });

  if (listMatches.length > 0) {
    return {
      source: "jkt48-official-ghostfetch",
      month,
      year,
      member_id: MEMBER_ID,
      count: listMatches.length,
      shows: listMatches,
    };
  }

  const codes = schedules
    .map((show) => show.reference_code)
    .filter((code): code is string => typeof code === "string");

  const showsResponses = await mapWithConcurrency(
    codes,
    DETAIL_CONCURRENCY,
    async (code) => {
      try {
        const showDetail = await fetchJson<ApiEnvelope<ShowData>>(
          `/theater-shows/${code}?lang=id`,
        );
        return showDetail.data ?? null;
      } catch (error) {
        console.warn(`[schedule-api] show fetch failed code=${code}`, error);
        return null;
      }
    },
  );

  const filteredShows = showsResponses.filter((show): show is ShowData => {
    if (!show || !Array.isArray(show.jkt48_member)) return false;
    return isTargetMemberShow(show);
  });

  return {
    source: "jkt48-official-ghostfetch",
    month,
    year,
    member_id: MEMBER_ID,
    count: filteredShows.length,
    shows: filteredShows,
  };
}

async function getSchedule(month: string, year: string) {
  const key = cacheKey(month, year);
  const cached = scheduleCache.get(key);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return { result: cached.result, cacheStatus: "HIT" };
  }

  const pending = pendingRequests.get(key);
  if (pending) {
    return { result: await pending, cacheStatus: "PENDING" };
  }

  const requestPromise = fetchOfficialSchedule(month, year);
  pendingRequests.set(key, requestPromise);

  try {
    const result = await requestPromise;
    scheduleCache.set(key, {
      result,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
    return { result, cacheStatus: "MISS" };
  } finally {
    pendingRequests.delete(key);
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const { month, year } = normalizeMonthYear(
      searchParams.get("month"),
      searchParams.get("year"),
    );

    const { result, cacheStatus } = await getSchedule(month, year);

    console.info("[schedule-api] result", {
      source: result.source,
      month: result.month,
      year: result.year,
      count: result.count,
      cache: cacheStatus,
    });

    return NextResponse.json(result.shows, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "X-Schedule-Cache": cacheStatus,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch schedules";
    console.error("[schedule-api] ghostfetch failed", { message });

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
