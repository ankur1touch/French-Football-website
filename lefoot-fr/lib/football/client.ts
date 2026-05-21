import { footballConfig } from "./config";
import type { ApiResponse } from "./types";

export class FootballApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FootballApiError";
  }
}

export async function fetchFootball<T>(
  path: string,
  params?: Record<string, string | number | undefined>
): Promise<T> {
  const url = new URL(
    path.startsWith("http") ? path : `${footballConfig.baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), footballConfig.timeoutMs);

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new FootballApiError(`Football API ${res.status}: ${path}`);
    }

    const data = (await res.json()) as ApiResponse<T> | T;
    if (data && typeof data === "object" && "response" in data) {
      return (data as ApiResponse<T>).response;
    }
    return data as T;
  } finally {
    clearTimeout(timeout);
  }
}
