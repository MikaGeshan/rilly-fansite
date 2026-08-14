import { NextResponse } from "next/server";

const DEV_BASE_URL = "http://0.0.0.0:3000/api/schedule";
const BASE_URL = process.env.BASE_URL ?? DEV_BASE_URL;
const MEMBER_ID = 39;
const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 12_000;

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
  jkt48_member?: Member[];
  jkt48_member_type?: string;
  default_price?: number;
  total_quota?: number;
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

interface ElysiaScheduleEnvelope {
  source?: string;
  member_id?: number;
  month?: string;
  year?: string;
  count?: number;
  shows?: ShowData[];
  error?: string;
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

function buildElysiaScheduleUrl(month: string, year: string) {
  const url = new URL(BASE_URL);

  url.searchParams.set("month", month);
  url.searchParams.set("year", year);

  return url;
}

function normalizeElysiaPayload(
  payload: ElysiaScheduleEnvelope | ShowData[],
  month: string,
  year: string,
): ScheduleResult {
  const shows = Array.isArray(payload) ? payload : payload.shows;

  if (!Array.isArray(shows)) {
    throw new Error("Elysia schedule API returned an invalid response");
  }

  return {
    source: Array.isArray(payload)
      ? "elysia-schedule-api"
      : (payload.source ?? "elysia-schedule-api"),
    month: Array.isArray(payload) ? month : (payload.month ?? month),
    year: Array.isArray(payload) ? year : (payload.year ?? year),
    member_id: Array.isArray(payload)
      ? MEMBER_ID
      : (payload.member_id ?? MEMBER_ID),
    count: shows.length,
    shows,
  };
}

async function parseErrorMessage(response: Response) {
  try {
    const payload = (await response.json()) as ElysiaScheduleEnvelope;
    return (
      payload.error ?? `Elysia schedule API failed with ${response.status}`
    );
  } catch {
    return `Elysia schedule API failed with ${response.status}`;
  }
}

async function fetchElysiaSchedule(
  month: string,
  year: string,
): Promise<ScheduleResult> {
  const url = buildElysiaScheduleUrl(month, year);
  const response = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const payload = (await response.json()) as
    | ElysiaScheduleEnvelope
    | ShowData[];
  return normalizeElysiaPayload(payload, month, year);
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

  const requestPromise = fetchElysiaSchedule(month, year);
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
        "X-Schedule-Source": result.source,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch schedules";
    console.error("[schedule-api] elysia fetch failed", { message });

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
