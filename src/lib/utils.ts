/**
 * Utility functions shared across the application.
 */

/**
 * Combines CSS class names dynamically.
 * A simple lightweight alternative to clsx/classnames.
 */
export function cn(...classes: (string | undefined | null | boolean | { [key: string]: boolean | undefined | null })[]): string {
  const result: string[] = [];

  for (const item of classes) {
    if (!item) continue;

    if (typeof item === "string") {
      result.push(item);
    } else if (typeof item === "object") {
      for (const [key, value] of Object.entries(item)) {
        if (value) {
          result.push(key);
        }
      }
    }
  }

  return result.join(" ");
}

/**
 * Format a date string into a readable format.
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a date into a readable Indonesian (id-ID) format, e.g. "1 April 2026".
 */
export function formatDateID(date: Date | string | number): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
