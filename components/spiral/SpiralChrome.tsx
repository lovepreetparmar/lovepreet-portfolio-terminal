"use client";

import { useEffect, useState } from "react";
import { getAboutProfile } from "@/lib/portfolio";

const LINES = [
  "Drag to look around inside the sphere.",
  "Scroll to zoom out and see the whole sphere.",
  "Hover a cell. It comes toward you.",
  "Click it to open the work behind it.",
] as const;

interface SpiralChromeProps {
  searchQuery: string;
  matchCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onOpenAbout: () => void;
  onOpenResume: () => void;
}

export function SpiralChrome({
  searchQuery,
  matchCount,
  totalCount,
  onSearchChange,
  onOpenAbout,
  onOpenResume,
}: SpiralChromeProps) {
  const profile = getAboutProfile();
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const filtering = searchQuery.trim().length > 0;

  useEffect(() => {
    const id = window.setInterval(() => {
      setLineIndex((index) => (index + 1) % LINES.length);
    }, 7000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-6 py-5 sm:px-10">
        <button
          type="button"
          aria-label={titleExpanded ? "Show short title" : "Show full title"}
          onClick={() => setTitleExpanded((expanded) => !expanded)}
          className="lp-focus-ring pointer-events-auto text-left"
        >
          <span className="block font-mono text-[10px] tracking-[0.42em] text-[#8a5a32] uppercase">
            {profile?.location ?? "Chandigarh"}
          </span>
          <span className="lp-editorial-display mt-1 block text-[1.65rem] leading-none text-[#241c16] sm:text-[2rem]">
            {titleExpanded ? profile?.name ?? "Lovepreet Parmar" : "Spiral"}
          </span>
        </button>

        <div className="pointer-events-auto flex items-center gap-2">
          <button type="button" onClick={onOpenAbout} className="lp-spiral-pill lp-focus-ring">
            About
          </button>
          <button type="button" onClick={onOpenResume} className="lp-spiral-pill lp-focus-ring">
            Resume
          </button>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-[11%] z-30 flex justify-center px-6">
        <label className="lp-spiral-search-shell pointer-events-auto w-full max-w-xl">
          <span className="sr-only">Search languages and tools</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search languages and tools…"
            className="lp-soot-search lp-focus-ring w-full"
          />
          <span className="mt-1 block text-center text-[11px] text-[#6d6258]">
            {filtering
              ? matchCount === 0
                ? "No matching language or tool"
                : `${matchCount} of ${totalCount} still forward`
              : `${totalCount} cells · drag to look · scroll to zoom`}
          </span>
        </label>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4">
        <p className="max-w-md text-center text-[12px] leading-relaxed text-[#5c5148]">
          {LINES[lineIndex]}
        </p>
      </div>
    </>
  );
}
