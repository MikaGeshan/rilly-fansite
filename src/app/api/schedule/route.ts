import { execFile } from "node:child_process";
import path from "node:path";
import { promisify } from "node:util";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

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
}

interface PythonScheduleResponse {
  source: string;
  month: string;
  year: string;
  member_id: number;
  count: number;
  shows: ShowData[];
}

const execFileAsync = promisify(execFile);
const PYTHON_BIN = process.env.PYTHON_BIN ?? "python3";
const SCRIPT_PATH = path.join(
  process.cwd(),
  "scripts",
  "fetch_jkt48_schedule.py",
);

function logScheduleResult(result: PythonScheduleResponse) {
  console.info("[schedule-api] result", {
    source: result.source,
    month: result.month,
    year: result.year,
    member_id: result.member_id,
    count: result.count,
    shows: result.shows.map((show) => ({
      code: show.code,
      title: show.title,
      date: show.date,
      start_time: show.start_time,
    })),
  });
}

async function fetchOfficialSchedule(month: string, year: string) {
  const { stdout, stderr } = await execFileAsync(
    PYTHON_BIN,
    [SCRIPT_PATH, "--month", month, "--year", year],
    {
      timeout: 30000,
      maxBuffer: 1024 * 1024,
    },
  );

  if (stderr.trim()) {
    console.warn("[schedule-api] python stderr", stderr.trim());
  }

  const result = JSON.parse(stdout) as PythonScheduleResponse;

  if (!Array.isArray(result.shows)) {
    throw new Error("Python schedule script returned an invalid response");
  }

  return result;
}

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "stderr" in error &&
    typeof error.stderr === "string"
  ) {
    try {
      const details = JSON.parse(error.stderr) as { error?: unknown };

      if (typeof details.error === "string") {
        return details.error;
      }
    } catch {
      return error.stderr.trim();
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to fetch schedules from JKT48 official API";
}

function parseIntInRange(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number | null {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  if (parsed < min || parsed > max) return null;
  return parsed;
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const month = searchParams.get("month") ?? String(now.getMonth() + 1);
    const year = searchParams.get("year") ?? String(now.getFullYear());
    const result = await fetchOfficialSchedule(month, year);

    logScheduleResult(result);

    return NextResponse.json(result.shows);
  } catch (error) {
    const message = getErrorMessage(error);

    console.error("[schedule-api] official python fetch failed", {
      message,
    });

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
