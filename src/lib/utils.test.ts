import { describe, it, expect } from "vitest";
import { cn, formatDate } from "@/lib/utils";

describe("cn", () => {
  it("joins string arguments with a single space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("ignores falsy values (undefined, null, false, empty string)", () => {
    expect(cn("a", undefined, null, false, "", "b")).toBe("a b");
  });

  it("includes object keys whose values are truthy and skips falsy ones", () => {
    expect(
      cn({
        active: true,
        disabled: false,
        hidden: undefined,
        visible: null,
      }),
    ).toBe("active");
  });

  it("combines strings and conditional objects together", () => {
    expect(cn("base", { on: true, off: false }, "end")).toBe("base on end");
  });

  it("returns an empty string when given no arguments", () => {
    expect(cn()).toBe("");
  });

  it("returns an empty string when all arguments are falsy", () => {
    expect(cn(undefined, null, false, "")).toBe("");
  });

  it("preserves the order of the provided classes", () => {
    expect(cn("z", { a: true }, "b")).toBe("z a b");
  });
});

describe("formatDate", () => {
  it("formats a Date instance as 'Month Day, Year'", () => {
    expect(formatDate(new Date(2023, 0, 5))).toBe("January 5, 2023");
  });

  it("formats an ISO date string", () => {
    // Use midday UTC to avoid timezone rollover into an adjacent day.
    expect(formatDate("2024-12-25T12:00:00Z")).toBe("December 25, 2024");
  });

  it("formats a numeric timestamp", () => {
    const timestamp = new Date(2020, 5, 15, 12).getTime();
    expect(formatDate(timestamp)).toBe("June 15, 2020");
  });
});
