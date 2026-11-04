"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useState } from "react";
import { SpiralScene } from "@/components/os/spiral/SpiralScene";
import type { PositionedSpiralNode } from "@/lib/spiral-layout";

interface SpiralCanvasProps {
  searchQuery: string;
  exploreNonce: number;
  onExplore: () => void;
  onNodeHover: (node: PositionedSpiralNode | null) => void;
  onNodeOpen: (node: PositionedSpiralNode) => void;
}

export function SpiralCanvas({
  searchQuery,
  exploreNonce,
  onExplore,
  onNodeHover,
  onNodeOpen,
}: SpiralCanvasProps) {
  const [zoom, setZoom] = useState(7.2);

  const onWheel = useCallback((event: WheelEvent) => {
    event.preventDefault();
    setZoom((value) => Math.min(12, Math.max(4.8, value + event.deltaY * 0.004)));
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
      aria-label="Work spiral. Move to look around, scroll to move closer, click a card to open it."
    >
      <Canvas
        camera={{ position: [0, 1.2, 7.2], fov: 34 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onPointerMissed={() => onExplore()}
      >
        <SpiralScene
          searchQuery={searchQuery}
          exploreNonce={exploreNonce}
          zoom={zoom}
          onNodeHover={onNodeHover}
          onNodeOpen={onNodeOpen}
        />
      </Canvas>
    </div>
  );
}
