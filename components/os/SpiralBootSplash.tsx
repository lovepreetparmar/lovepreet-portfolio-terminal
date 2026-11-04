"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "lp-spiral-boot-seen";

function readSkipBoot(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribeBoot() {
  return () => {};
}

export function SpiralBootSplash() {
  const skip = useSyncExternalStore(subscribeBoot, readSkipBoot, () => true);

  if (skip) {
    return null;
  }

  return (
    <div
      className="lp-spiral-boot lp-no-print fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#efe6da] text-neutral-900"
      aria-hidden="true"
      onAnimationEnd={() => {
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // ignore
        }
      }}
    >
      <p className="font-mono text-lg tracking-[0.55em] text-neutral-800 uppercase">Spiral</p>
    </div>
  );
}
