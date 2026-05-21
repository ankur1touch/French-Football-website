import { readLocalJSON } from "@/lib/data";
import { footballConfig } from "./config";

export async function withFallback<T>(
  fetchFn: () => Promise<T>,
  mockFile: string
): Promise<T> {
  try {
    return await fetchFn();
  } catch (error) {
    if (!footballConfig.mockFallback) throw error;
    console.warn(`[football] fallback to ${mockFile}:`, error);
    return readLocalJSON<T>(mockFile);
  }
}
