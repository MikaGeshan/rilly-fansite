import { describe, it, expect, beforeEach, vi } from "vitest";

const { mockExecFile } = vi.hoisted(() => ({
  mockExecFile: vi.fn(),
}));

vi.mock("node:child_process", () => ({
  default: { execFile: mockExecFile },
  execFile: mockExecFile,
}));

import { GET } from "@/app/api/schedule/route";

const MEMBER_ID = 39;

function makeShow(code: string, memberIds = [MEMBER_ID]) {
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
  };
}

function pythonResponse(shows = [makeShow("a")]) {
  return JSON.stringify({
    source: "jkt48-official-python",
    month: "8",
    year: "2026",
    member_id: MEMBER_ID,
    count: shows.length,
    shows,
  });
}

function request(query = "") {
  return new Request(`http://localhost/api/schedule${query}`);
}

function mockPythonSuccess(stdout = pythonResponse(), stderr = "") {
  mockExecFile.mockImplementation((_bin, _args, _options, callback) => {
    callback(null, stdout, stderr);
  });
}

function mockPythonFailure(stderr: string) {
  mockExecFile.mockImplementation((_bin, _args, _options, callback) => {
    const error = new Error("python failed") as Error & { stderr: string };
    error.stderr = stderr;
    callback(error, "", stderr);
  });
}

describe("GET /api/schedule", () => {
  beforeEach(() => {
    mockExecFile.mockReset();
    vi.unstubAllEnvs();
  });

  it("returns shows from the official Python fetcher", async () => {
    mockPythonSuccess(pythonResponse([makeShow("a"), makeShow("b")]));

    const res = await GET(request("?month=8&year=2026"));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toHaveLength(2);
    expect(body[0].code).toBe("a");
  });

  it("passes month and year query params to the Python script", async () => {
    mockPythonSuccess(pythonResponse([]));

    await GET(request("?month=7&year=2030"));

    expect(mockExecFile).toHaveBeenCalledWith(
      "python3",
      [
        expect.stringContaining("scripts/fetch_jkt48_schedule.py"),
        "--month",
        "7",
        "--year",
        "2030",
      ],
      expect.objectContaining({
        timeout: 30000,
        maxBuffer: 1024 * 1024,
      }),
      expect.any(Function),
    );
  });

  it("defaults to the current month and year when params are absent", async () => {
    mockPythonSuccess(pythonResponse([]));
    const now = new Date();

    await GET(request());

    expect(mockExecFile).toHaveBeenCalledWith(
      "python3",
      expect.arrayContaining([
        "--month",
        String(now.getMonth() + 1),
        "--year",
        String(now.getFullYear()),
      ]),
      expect.any(Object),
      expect.any(Function),
    );
  });

  it("adds the vendored Python packages directory to PYTHONPATH", async () => {
    vi.stubEnv("PYTHONPATH", "existing-path");
    mockPythonSuccess(pythonResponse([]));

    await GET(request());

    expect(mockExecFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array),
      expect.objectContaining({
        env: expect.objectContaining({
          PYTHONPATH: expect.stringMatching(/\.python_packages.*existing-path/),
        }),
      }),
      expect.any(Function),
    );
  });

  it("returns 502 with the Python stderr JSON message when the request fails", async () => {
    mockPythonFailure(
      JSON.stringify({
        source: "jkt48-official-python",
        ok: false,
        error: "Cloudflare challenge",
        status: 403,
      }),
    );

    const res = await GET(request());
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBe("Cloudflare challenge");
  });

  it("returns 502 when the Python response is invalid", async () => {
    mockPythonSuccess(JSON.stringify({ shows: null }));

    const res = await GET(request());
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.error).toBe("Python schedule script returned an invalid response");
  });
});
