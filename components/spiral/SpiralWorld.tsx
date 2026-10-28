"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { SpiralAboutOverlay } from "@/components/spiral/SpiralAboutOverlay";
import { SpiralBootSplash } from "@/components/os/SpiralBootSplash";
import { SpiralChrome } from "@/components/spiral/SpiralChrome";
import { SpiralMobileExplore } from "@/components/spiral/SpiralMobileExplore";
import { SpiralProjectOverlay } from "@/components/spiral/SpiralProjectOverlay";
import { SpiralResumeOverlay } from "@/components/spiral/SpiralResumeOverlay";
import { COMPACT_BREAKPOINT } from "@/lib/compact";
import { buildSpiralNodes, filterSpiralNodes } from "@/lib/spiral-nodes";
import type { PositionedSpiralNode } from "@/lib/spiral-layout";

const SpiralCanvas = dynamic(
  () =>
    import("@/components/os/spiral/SpiralCanvas").then((mod) => mod.SpiralCanvas),
  { ssr: false },
);

type OverlayState =
  | { type: "about" }
  | { type: "resume" }
  | { type: "project"; projectId: string }
  | null;

export function SpiralWorld() {
  const [searchQuery, setSearchQuery] = useState("");
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [compact, setCompact] = useState(false);
  const [exploreNonce, setExploreNonce] = useState(0);

  const allNodes = useMemo(() => buildSpiralNodes(), []);
  const matchCount = useMemo(
    () => filterSpiralNodes(allNodes, searchQuery).length,
    [allNodes, searchQuery],
  );

  useEffect(() => {
    const sync = () => setCompact(window.innerWidth < COMPACT_BREAKPOINT);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (!overlay) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOverlay(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [overlay]);

  const onNodeFocus = (node: PositionedSpiralNode) => {
    setSearchQuery(node.label);
  };

  const onNodeOpen = (node: PositionedSpiralNode) => {
    setOverlay({ type: "project", projectId: node.projectId });
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-[#dcdcde] text-neutral-900" data-spiral-app>
      <SpiralBootSplash />

      {!overlay && !compact ? (
        <SpiralCanvas
          searchQuery={searchQuery}
          exploreNonce={exploreNonce}
          onExplore={() => setExploreNonce((value) => value + 1)}
          onNodeFocus={onNodeFocus}
          onNodeOpen={onNodeOpen}
        />
      ) : null}

      {!overlay && compact ? (
        <SpiralMobileExplore
          searchQuery={searchQuery}
          onSelectProject={(projectId) =>
            setOverlay({ type: "project", projectId })
          }
        />
      ) : null}

      {!overlay ? (
        <SpiralChrome
          searchQuery={searchQuery}
          matchCount={matchCount}
          totalCount={allNodes.length}
          onSearchChange={setSearchQuery}
          onOpenAbout={() => setOverlay({ type: "about" })}
          onOpenResume={() => setOverlay({ type: "resume" })}
        />
      ) : null}

      {overlay?.type === "about" ? (
        <SpiralAboutOverlay
          onClose={() => setOverlay(null)}
          onOpenResume={() => setOverlay({ type: "resume" })}
        />
      ) : null}

      {overlay?.type === "resume" ? (
        <SpiralResumeOverlay onClose={() => setOverlay(null)} />
      ) : null}

      {overlay?.type === "project" ? (
        <SpiralProjectOverlay
          projectId={overlay.projectId}
          onClose={() => setOverlay(null)}
        />
      ) : null}
    </div>
  );
}
