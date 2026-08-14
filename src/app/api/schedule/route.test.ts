import { describe, it, expect, beforeEach, vi } from "vitest";

const { mockGhostFetch } = vi.hoisted(() => ({
  mockGhostFetch: vi.fn(),
}));

vi.mock("ghostfetch", () => ({
  ghostFetch: mockGhostFetch,
}));

import { clearScheduleRouteCache, GET } from "@/app/api/schedule/route";

const MEMBER_ID = 39;

function makeShow(
  code: string,
  memberIds = [MEMBER_ID],
  referenceCode = code,
) {
  return {
    code,
    title: `Show ${code}`,
    date: "2026-08-20",
    start_time: "18:00",
    end_time: "20:00",
    jkt48_member: memberIds.map((id) => ({
      name: `member-${id}`,
      type: "regular",
      member_id: id,
    })),
    jkt48_member_type: "regular",
    default_price: 100,
    total_quota: 200,
    reference_code: referenceCode,
  };
}

function jsonResponse(data: unknown, status = 200) {
  return {
    status,
    json: vi.fn().mockResolvedValue(data),
  };
}

function request(query = "") {
  return new Request(`http://localhost/api/schedule${query}`);
}

describe("GET /api/schedule", () => {
  beforeEach(() => {
    mockGhostFetch.mockReset();
    clearScheduleRouteCache();
  });

  it("returns matching shows directly from the schedule list", async () => {
    mockGhostFetch.mockResolvedValueOnce(
      jsonResponse({
        data: [makeShow("a"), makeShow("b", [999])],
      }),
    );

    const res = await GET(request("?month=8&year=2026"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get("X-Schedule-Cache")).toBe("MISS");
    expect(body).toHaveLength(1);
    expect(body[0].code).toBe("a");
    expect(mockGhostFetch).toHaveBeenCalledTimes(1);
    expect(mockGhostFetch).toHaveBeenCalledWith(
      "https://jkt48.com/api/v1/schedules?lang=id&month=8&year=2026&type=show",
      { browser: "Chrome_131" },
    );
  });

  it("fetches show details when the list has no member payload", async () => {
    mockGhostFetch
      .mockResolvedValueOnce(
        jsonResponse({
          data: [
            { ...makeShow("a", [], "ref-a"), jkt48_member: [] },
            { ...makeShow("b", [], "ref-b"), jkt48_member: [] },
          ],
        }),
      )
      .mockResolvedValueOnce(jsonResponse({ data: makeShow("a", [999]) }))
      .mockResolvedValueOnce(jsonResponse({ data: makeShow("b") }));

    const res = await GET(request("?month=7&year=2026"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(1);
    expect(body[0].code).toBe("b");
    expect(mockGhostFetch).toHaveBeenCalledTimes(3);
    expect(mockGhostFetch).toHaveBeenNthCalledWith(
      2,
      "https://jkt48.com/api/v1/theater-shows/ref-a?lang=id",
      { browser: "Chrome_131" },
    );
    expect(mockGhostFetch).toHaveBeenNthCalledWith(
      3,
      "https://jkt48.com/api/v1/theater-shows/ref-b?lang=id",
      { browser: "Chrome_131" },
    );
  });

  it("defaults to the current month and year when params are absent", async () => {
    mockGhostFetch.mockResolvedValueOnce(jsonResponse({ data: [] }));
    const now = new Date();

    await GET(request());

    expect(mockGhostFetch).toHaveBeenCalledWith(
      `https://jkt48.com/api/v1/schedules?lang=id&month=${
        now.getMonth() + 1
      }&year=${now.getFullYear()}&type=show`,
      { browser: "Chrome_131" },
    );
  });

  it("caches repeated month requests", async () => {
    mockGhostFetch.mockResolvedValueOnce(
      jsonResponse({
        data: [makeShow("cached")],
      }),
    );

    const first = await GET(request("?month=9&year=2026"));
    const second = await GET(request("?month=9&year=2026"));

    expect(first.headers.get("X-Schedule-Cache")).toBe("MISS");
    expect(second.headers.get("X-Schedule-Cache")).toBe("HIT");
    expect(mockGhostFetch).toHaveBeenCalledTimes(1);
  });

  it("returns 502 when the official API request fails", async () => {
    mockGhostFetch.mockResolvedValueOnce(jsonResponse({ error: "blocked" }, 403));

    const res = await GET(request("?month=10&year=2026"));
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBe(
      "Cloudflare blocked the request to /schedules?lang=id&month=10&year=2026&type=show. Status: 403",
    );
  });
});
