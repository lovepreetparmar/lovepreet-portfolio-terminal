export const COMPACT_BREAKPOINT = 768;

export function isCompactViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.innerWidth < COMPACT_BREAKPOINT;
}
