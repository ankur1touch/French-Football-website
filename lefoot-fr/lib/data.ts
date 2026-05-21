import { readFileSync } from "fs";
import { join } from "path";

export function readLocalJSON<T>(filename: string): T {
  const filePath = join(process.cwd(), "data", filename);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}
