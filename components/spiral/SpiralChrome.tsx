"use client";

import { useState } from "react";
import { getAboutProfile } from "@/lib/portfolio";

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
  const filtering = searchQuery.trim().length > 0;

  const statLine = filtering
    ? matchCount === 0
      ? "No matching language or tool"
      : `${matchCount} of ${totalCount} still forward`
    : `${totalCount} cells · drag to look · scroll to zoom`;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div className="pointer-events-auto absolute top-6 left-6 z-10 flex flex-col gap-4 sm:left-10">
        <button
          type="button"
          aria-label={titleExpanded ? "Show short title" : "Show full title"}
          onClick={() => setTitleExpanded((expanded) => !expanded)}
          className="lp-focus-ring text-left"
        >
          <span className="block font-mono text-[10px] tracking-[0.42em] text-[#8a5a32] uppercase">
            {profile?.location ?? "Chandigarh"}
          </span>
          <span className="lp-editorial-display mt-1 block text-[1.65rem] leading-none text-[#241c16] sm:text-[2rem]">
            {titleExpanded ? profile?.name ?? "Lovepreet Parmar" : "Spiral"}
          </span>
        </button>

        <label>
          <span className="sr-only">Search languages and tools</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search languages and tools…"
            className="lp-focus-ring w-64 border-b border-[#a3978a] bg-transparent pb-1 font-sans text-sm text-[#241c16] outline-none placeholder:text-[#6d6258]"
          />
        </label>
      </div>

      <div className="pointer-events-auto absolute top-6 right-6 z-10 flex items-center gap-2 sm:right-10">
        <button type="button" onClick={onOpenAbout} className="lp-spiral-pill lp-focus-ring">
          About
        </button>
        <button type="button" onClick={onOpenResume} className="lp-spiral-pill lp-focus-ring">
          Resume
        </button>
      </div>

      <p className="pointer-events-none absolute bottom-6 left-6 z-10 max-w-md font-mono text-xs tracking-wide text-[#6d6258] sm:left-10">
        {statLine}
      </p>
    </div>
  );
}