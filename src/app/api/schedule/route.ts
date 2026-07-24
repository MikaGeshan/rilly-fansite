import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

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

interface ShowResponse {
  status: boolean;
  message: string;
  data: ShowData;
}

interface ScheduleItem {
  reference_code: string;
}

interface SchedulesResponse {
  status: boolean;
  message: string;
  data: ScheduleItem[];
}

const BASE_URL = "https://jkt48.com/api/v1";
const MEMBER_ID = 39;

const jkt48Api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  },
});

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const now = new Date();
    const month = searchParams.get("month") ?? String(now.getMonth() + 1);
    const year = searchParams.get("year") ?? String(now.getFullYear());

    // Fetch data jadwal
    const { data: schedulesResponse } = await jkt48Api.get<SchedulesResponse>(
      `/schedules?lang=id&month=${month}&year=${year}&type=show`,
    );

    if (!Array.isArray(schedulesResponse?.data)) {
      throw new Error(
        schedulesResponse?.message ?? "Unexpected schedules response shape",
      );
    }

    const codes = schedulesResponse.data.map((show) => show.reference_code);

    // Fetch semua show
    const showResults = await Promise.all(
      codes.map((code) =>
        jkt48Api
          .get<ShowResponse>(`/theater-shows/${code}?lang=id`)
          .then((res) => res.data)
          .catch((error) => {
            console.error(`Failed to fetch theater show ${code}:`, error);
            return null;
          }),
      ),
    );

    // Filter show sesuai dengan show rilly
    const filteredShows = showResults
      .filter((show): show is ShowResponse => show !== null)
      .filter((show) =>
        show.data.jkt48_member.some((m) => m.member_id === MEMBER_ID),
      )
      .map((show) => show.data);

    return NextResponse.json(filteredShows);
  } catch (error) {
    console.error("Failed to fetch schedules:", error);

    const message =
      error instanceof AxiosError
        ? error.message
        : error instanceof Error
          ? error.message
          : "Failed to fetch schedules";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
