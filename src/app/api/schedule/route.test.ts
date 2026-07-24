import { describe, it, expect, beforeEach, vi } from "vitest";

const { mockGet } = vi.hoisted(() => ({ mockGet: vi.fn() }));

vi.mock("axios", () => {
  class AxiosError extends Error {}
  return {
    default: { create: vi.fn(() => ({ get: mockGet })) },
    AxiosError,
  };
});

import { AxiosError } from "axios";
import { GET } from "@/app/api/schedule/route";

const MEMBER_ID = 39;

// Mimics the axios response shape: `.data` holds the ShowResponse wrapper,
// whose own `.data` holds the ShowData.
function makeShow(code: string, memberIds: number[]) {
  return {
    data: {
      status: true,
      message: "ok",
      data: {
        code,
        title: `Show ${code}`,
        date: "2024-03-01",
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
      },
    },
  };
}

function schedulesResponse(codes: string[]) {
  return {
    data: {
      status: true,
      message: "ok",
      data: codes.map((reference_code) => ({ reference_code })),
    },
  };
}

function request(query = "") {
  return new Request(`http://localhost/api/schedule${query}`);
}

describe("GET /api/schedule", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("returns only shows that include the target member", async () => {
    mockGet.mockImplementation((url: string) => {
      if (url.startsWith("/schedules")) {
        return Promise.resolve(schedulesResponse(["a", "b"]));
      }
      if (url.includes("/theater-shows/a")) {
        return Promise.resolve(makeShow("a", [MEMBER_ID, 1]));
      }
      return Promise.resolve(makeShow("b", [2, 3]));
    });

    const res = await GET(request("?month=3&year=2024"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].code).toBe("a");
  });

  it("drops shows whose fetch failed (null results)", async () => {
    mockGet.mockImplementation((url: string) => {
      if (url.startsWith("/schedules")) {
        return Promise.resolve(schedulesResponse(["a", "b"]));
      }
      if (url.includes("/theater-shows/a")) {
        return Promise.resolve(makeShow("a", [MEMBER_ID]));
      }
      return Promise.reject(new Error("boom"));
    });

    const res = await GET(request());
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].code).toBe("a");
  });

  it("returns an empty array when no show includes the member", async () => {
    mockGet.mockImplementation((url: string) => {
      if (url.startsWith("/schedules")) {
        return Promise.resolve(schedulesResponse(["a"]));
      }
      return Promise.resolve(makeShow("a", [999]));
    });

    const res = await GET(request());
    const body = await res.json();
    expect(body).toEqual([]);
  });

  it("passes month and year query params through to the schedules request", async () => {
    mockGet.mockResolvedValue(schedulesResponse([]));

    await GET(request("?month=7&year=2030"));

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining("month=7&year=2030"),
    );
  });

  it("defaults to the current month and year when params are absent", async () => {
    mockGet.mockResolvedValue(schedulesResponse([]));
    const now = new Date();

    await GET(request());

    expect(mockGet).toHaveBeenCalledWith(
      expect.stringContaining(
        `month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
      ),
    );
  });

  it("returns 500 with the axios error message when the request fails", async () => {
    mockGet.mockRejectedValue(new AxiosError("network down"));

    const res = await GET(request());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("network down");
  });

  it("returns 500 with a fallback message for non-axios errors", async () => {
    mockGet.mockRejectedValue(new Error("unexpected"));

    const res = await GET(request());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toBe("=== failed to fetch schedules");
  });
});
