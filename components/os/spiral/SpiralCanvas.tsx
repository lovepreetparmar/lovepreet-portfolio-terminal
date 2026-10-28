"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useState } from "react";
import { SpiralScene } from "@/components/os/spiral/SpiralScene";
import type { PositionedSpiralNode } from "@/lib/spiral-layout";

interface SpiralCanvasProps {
  searchQuery: string;
  exploreNonce: number;
  onExplore: () => void;
  onNodeFocus: (node: PositionedSpiralNode) => void;
  onNodeOpen: (node: PositionedSpiralNode) => void;
}

export function SpiralCanvas({
  searchQuery,
  exploreNonce,
  onExplore,
  onNodeFocus,
  onNodeOpen,
}: SpiralCanvasProps) {
  const [zoom, setZoom] = useState(11);

  const onWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    setZoom((value) => Math.min(18, Math.max(6, value + event.deltaY * 0.008)));
  }, []);

  useEffect(() => {
    const element = document.getElementById("lp-spiral-canvas-root");

    if (!element) {
      return;
    }

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => element.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  return (
    <div
      id="lp-spiral-canvas-root"
      className="lp-spiral-stage absolute inset-0 touch-none"
      aria-label="Work cloud — move your cursor to explore images, click to search, double-click to open"
    >
      <Canvas
        camera={{ position: [0, 2, 11], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onPointerMissed={() => onExplore()}
      >
        <SpiralScene
          searchQuery={searchQuery}
          exploreNonce={exploreNonce}
          zoom={zoom}
          onNodeFocus={onNodeFocus}
          onNodeOpen={onNodeOpen}
        />
      </Canvas>
    </div>
  );
}
