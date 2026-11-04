"use client";

import { Suspense, useMemo } from "react";
import { SpiralImageTile } from "@/components/os/spiral/SpiralImageTile";
import { SpiralSootCamera } from "@/components/os/spiral/SpiralSootCamera";
import { layoutSpiral, type PositionedSpiralNode } from "@/lib/spiral-layout";
import { buildSpiralNodes, filterSpiralNodes } from "@/lib/spiral-nodes";

interface SpiralSceneProps {
  searchQuery: string;
  exploreNonce: number;
  zoom: number;
  onNodeHover: (node: PositionedSpiralNode | null) => void;
  onNodeOpen: (node: PositionedSpiralNode) => void;
}

export function SpiralScene({
  searchQuery,
  exploreNonce,
  zoom,
  onNodeHover,
  onNodeOpen,
}: SpiralSceneProps) {
  const baseNodes = useMemo(() => buildSpiralNodes(), []);
  const nodes = useMemo(() => layoutSpiral(baseNodes), [baseNodes]);
  const matched = useMemo(
    () => filterSpiralNodes(baseNodes, searchQuery),
    [baseNodes, searchQuery],
  );
  const matchedIds = useMemo(() => new Set(matched.map((node) => node.id)), [matched]);
  const hasFilter = searchQuery.trim().length > 0;
  const focusNode = useMemo(() => {
    if (!hasFilter || matched.length !== 1) {
      return null;
    }

    const onlyId = matched[0]?.id;
    return nodes.find((node) => node.id === onlyId) ?? null;
  }, [hasFilter, matched, nodes]);

  return (
    <>
      <color attach="background" args={["#efe6da"]} />
      <hemisphereLight args={["#fff6ea", "#d9c7b2", 1.15]} />
      <directionalLight position={[4, 6, 5]} intensity={1.1} color="#fff4e4" />
      <pointLight position={[-3, 1, 2]} intensity={8} color="#e7a15a" distance={14} />

      <Suspense fallback={null}>
        {nodes.map((node) => (
          <SpiralImageTile
            key={node.id}
            node={node}
            dimmed={hasFilter && !matchedIds.has(node.id)}
            highlighted={hasFilter && matchedIds.has(node.id)}
            onHover={onNodeHover}
            onOpen={onNodeOpen}
          />
        ))}
      </Suspense>

      <SpiralSootCamera focusNode={focusNode} exploreNonce={exploreNonce} zoom={zoom} />
    </>
  );
}
