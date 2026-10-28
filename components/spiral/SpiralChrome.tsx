"use client";

import { useEffect, useMemo, useState } from "react";
import { ProjectArt } from "@/components/apps/ProjectArt";
import { getAboutProfile, getExplorerProjects } from "@/lib/portfolio";
import { resolveProjectVisual } from "@/lib/project-visuals";

const FEATURES = [
  {
    title: "Map your World",
    body: "Turn projects into a connected, searchable spiral — explore with your cursor.",
  },
  {
    title: "A portfolio filesystem",
    body: "About, resume, and work share one visual map instead of app windows.",
  },
  {
    title: "The spiral is the interface",
    body: "Click a tile to search it; double-click to open the full story.",
  },
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
  const projects = useMemo(() => getExplorerProjects(), []);
  const [titleExpanded, setTitleExpanded] = useState(false);
  const [featureIndex, setFeatureIndex] = useState(0);
  const [featureDismissed, setFeatureDismissed] = useState(false);
  const feature = FEATURES[featureIndex];
  const previewProject = projects[featureIndex % projects.length] ?? projects[0];

  useEffect(() => {
    const id = window.setInterval(() => {
      setFeatureIndex((index) => (index + 1) % FEATURES.length);
    }, 7000);

    return () => window.clearInterval(id);
  }, []);

  const filtering = searchQuery.trim().length > 0;

  return (
    <>
      <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between px-5 py-5 sm:px-8">
        <button
          type="button"
          aria-label={titleExpanded ? "Show short title" : "Show full title"}
          onClick={() => setTitleExpanded((expanded) => !expanded)}
          className="lp-focus-ring pointer-events-auto text-left font-mono text-sm tracking-[0.35em] text-neutral-800 uppercase"
        >
          {titleExpanded ? profile?.name ?? "Lovepreet Parmar" : "LP · Spiral"}
        </button>

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAbout}
            className="lp-focus-ring text-[11px] tracking-wide text-neutral-700 hover:text-neutral-900"
          >
            About
          </button>
          <button
            type="button"
            onClick={onOpenResume}
            className="lp-focus-ring text-[11px] tracking-wide text-neutral-700 hover:text-neutral-900"
          >
            Resume
          </button>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-[12%] z-30 flex flex-col items-center px-4 sm:top-[11%]">
        <label className="pointer-events-auto w-full max-w-2xl">
          <span className="sr-only">Search the spiral</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder=""
            className="lp-soot-search lp-focus-ring w-full"
          />
        </label>
        {filtering ? (
          <p className="mt-3 text-center text-[11px] tabular-nums text-neutral-600">
            {matchCount} of {totalCount} results
          </p>
        ) : null}
      </div>

      <p className="pointer-events-none absolute inset-x-0 top-[19%] z-30 text-center text-[11px] text-neutral-600 sm:top-[18%]">
        Click anywhere to explore, or search to be more specific.
      </p>

      {!featureDismissed ? (
        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-4 pb-5 sm:px-8 sm:pb-7">
          <div className="pointer-events-auto mx-auto flex max-w-3xl gap-4 rounded-2xl border border-black/[0.08] bg-white/80 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.1)] backdrop-blur-md sm:p-4">
            {previewProject ? (
              <div className="hidden w-[140px] shrink-0 overflow-hidden rounded-xl sm:block">
                <ProjectArt
                  visual={resolveProjectVisual(previewProject)}
                  title={previewProject.title}
                  size="thumb"
                  className="min-h-[100px] rounded-none"
                />
              </div>
            ) : null}

            <div className="min-w-0 flex-1">
              <div className="flex gap-1.5">
                {FEATURES.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-current={index === featureIndex}
                    aria-label={`Show feature: ${item.title}`}
                    onClick={() => setFeatureIndex(index)}
                    className={`h-1 flex-1 rounded-full ${
                      index === featureIndex ? "bg-neutral-800" : "bg-neutral-300"
                    }`}
                  />
                ))}
              </div>
              <h2 className="mt-3 text-sm font-semibold text-neutral-900">{feature.title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-neutral-600">{feature.body}</p>
            </div>

            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => setFeatureDismissed(true)}
              className="lp-focus-ring shrink-0 self-start rounded-md px-2 py-1 text-[10px] text-neutral-500 hover:text-neutral-800"
            >
              ✕
            </button>
          </div>
        </footer>
      ) : null}
    </>
  );
}
