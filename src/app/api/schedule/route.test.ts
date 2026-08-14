import { describe, it, expect, beforeEach, vi } from "vitest";
import { clearScheduleRouteCache, GET } from "@/app/api/schedule/route";

const MEMBER_ID = 39;

function makeShow(code: string) {
  return {
    code,
    title: `Show ${code}`,
    date: "2026-08-20",
    start_time: "18:00",
    end_time: "20:00",
    jkt48_member: [
      {
        name: "Rilly",
        type: "regular",
        member_id: MEMBER_ID,
      },
    ],
  };
}

function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function request(query = "") {
  return new Request(`http://localhost/api/schedule${query}`);
}

function mockFetch() {
  const fetchMock = vi.fn<typeof fetch>();
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("GET /api/schedule", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    clearScheduleRouteCache();
  });

  it("proxies month and year to the Elysia schedule API", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce(jsonResponse([makeShow("a")]));

    const res = await GET(request("?month=8&year=2026"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get("X-Schedule-Cache")).toBe("MISS");
    expect(res.headers.get("X-Schedule-Source")).toBe("elysia-schedule-api");
    expect(body).toHaveLength(1);
    expect(body[0].code).toBe("a");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("http://0.0.0.0:3000/api/schedule?month=8&year=2026"),
      expect.objectContaining({
        cache: "no-store",
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("accepts an Elysia response envelope with shows", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        source: "elysia-custom",
        month: "7",
        year: "2026",
        count: 1,
        shows: [makeShow("b")],
      }),
    );

    const res = await GET(request("?month=7&year=2026"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get("X-Schedule-Source")).toBe("elysia-custom");
    expect(body[0].code).toBe("b");
  });

  it("defaults to the current month and year when params are absent", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce(jsonResponse([]));
    const now = new Date();

    await GET(request());

    expect(fetchMock).toHaveBeenCalledWith(
      new URL(
        `http://0.0.0.0:3000/api/schedule?month=${
          now.getMonth() + 1
        }&year=${now.getFullYear()}`,
      ),
      expect.any(Object),
    );
  });

  it("caches repeated Elysia requests for the same month", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce(jsonResponse([makeShow("cached")]));

    const first = await GET(request("?month=9&year=2026"));
    const second = await GET(request("?month=9&year=2026"));

    expect(first.headers.get("X-Schedule-Cache")).toBe("MISS");
    expect(second.headers.get("X-Schedule-Cache")).toBe("HIT");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("returns 502 when the Elysia schedule API fails", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ error: "Elysia unavailable" }, 503),
    );

    const res = await GET(request("?month=10&year=2026"));
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBe("Elysia unavailable");
  });

  it("returns 502 when Elysia returns an invalid payload", async () => {
    const fetchMock = mockFetch();
    fetchMock.mockResolvedValueOnce(jsonResponse({ shows: null }));

    const res = await GET(request("?month=11&year=2026"));
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBe("Elysia schedule API returned an invalid response");
  });
});
