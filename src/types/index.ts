/**
 * Shared TypeScript type definitions and interfaces.
 */

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: "admin" | "user";
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
