"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { SpiralAboutOverlay } from "@/components/spiral/SpiralAboutOverlay";
import { SpiralBootSplash } from "@/components/os/SpiralBootSplash";
import { SpiralChrome } from "@/components/spiral/SpiralChrome";
import { SpiralCraftOverlay } from "@/components/spiral/SpiralCraftOverlay";
import { SpiralProjectOverlay } from "@/components/spiral/SpiralProjectOverlay";
import { SpiralResumeOverlay } from "@/components/spiral/SpiralResumeOverlay";
import { COMPACT_BREAKPOINT } from "@/lib/compact";
import { buildSpiralNodes, filterSpiralNodes } from "@/lib/spiral-nodes";

const HexField = dynamic(
  () => import("@/components/spiral/HexField").then((mod) => mod.HexField),
  { ssr: false },
);

type OverlayState =
  | { type: "about" }
  | { type: "resume" }
  | { type: "craft"; craftId: string }
  | { type: "project"; projectId: string; fromCraft?: string }
  | null;

export function SpiralWorld() {
  const [searchQuery, setSearchQuery] = useState("");
  const [overlay, setOverlay] = useState<OverlayState>(null);
  const [compact, setCompact] = useState(false);
  const [launch, setLaunch] = useState<{ id: string; color: string } | null>(null);
  const openTimer = useRef<number | null>(null);
  const washTimer = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (openTimer.current) {
        window.clearTimeout(openTimer.current);
      }

      if (washTimer.current) {
        window.clearTimeout(washTimer.current);
      }
    };
  }, []);

  const onOpenCraft = (craftId: string) => {
    const node = allNodes.find((item) => item.id === craftId);

    if (!node || overlay) {
      return;
    }

    if (openTimer.current) {
      window.clearTimeout(openTimer.current);
    }

    if (washTimer.current) {
      window.clearTimeout(washTimer.current);
    }

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setLaunch(null);
      setOverlay({ type: "craft", craftId });
      return;
    }

    setLaunch({ id: craftId, color: node.palette.bg });
    openTimer.current = window.setTimeout(() => {
      setOverlay({ type: "craft", craftId });
      washTimer.current = window.setTimeout(() => setLaunch(null), 360);
    }, 720);
  };

  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-[#efe6da] text-[#241c16]" data-spiral-app>
      <SpiralBootSplash />

      <nav className="sr-only" aria-label="Languages and tools">
        {allNodes.map((node) => (
          <button key={node.id} type="button" onClick={() => onOpenCraft(node.id)}>
            {node.label}
          </button>
        ))}
      </nav>

      <HexField
        searchQuery={searchQuery}
        focusId={launch?.id ?? null}
        tight={Boolean(launch)}
        compact={compact}
        interactive={!overlay && !launch}
        onOpen={onOpenCraft}
      />

      {launch ? <div className="lp-hex-wash" style={{ background: launch.color }} /> : null}

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

      {overlay?.type === "craft" ? (
        <SpiralCraftOverlay
          craftId={overlay.craftId}
          onClose={() => setOverlay(null)}
          onOpenProject={(projectId) =>
            setOverlay({ type: "project", projectId, fromCraft: overlay.craftId })
          }
        />
      ) : null}

      {overlay?.type === "project" ? (
        <SpiralProjectOverlay
          projectId={overlay.projectId}
          onClose={() =>
            setOverlay(
              overlay.fromCraft ? { type: "craft", craftId: overlay.fromCraft } : null,
            )
          }
        />
      ) : null}
    </div>
  );
}
