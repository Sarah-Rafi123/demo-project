import type { Verdict } from "@/types";

export function randomVerdict(): Verdict {
  return Math.random() < 0.5 ? "truth" : "lie";
}
