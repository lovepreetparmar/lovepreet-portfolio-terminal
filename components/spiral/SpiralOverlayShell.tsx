"use client";

import type { ReactNode } from "react";

interface SpiralOverlayShellProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function SpiralOverlayShell({
  title,
  onClose,
  children,
}: SpiralOverlayShellProps) {
  return (
    <div
      className="lp-spiral-overlay lp-spiral-overlay-in fixed inset-0 z-50 flex flex-col bg-[#dcdcde] text-neutral-900"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-black/10 px-5 py-4 sm:px-8">
        <p className="text-sm font-medium text-neutral-800">{title}</p>
        <button
          type="button"
          onClick={onClose}
          className="lp-focus-ring rounded-full border border-black/15 px-3 py-1 text-[11px] tracking-wide text-neutral-600 uppercase hover:bg-white/60"
        >
          Close
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
