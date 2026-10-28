"use client";

import { Suspense, useMemo, useRef } from "react";
import type { Group } from "three";
import { SpiralImageTile } from "@/components/os/spiral/SpiralImageTile";
import { SpiralSootCamera } from "@/components/os/spiral/SpiralSootCamera";
import { layoutSpiral } from "@/lib/spiral-layout";
import { buildSpiralNodes, filterSpiralNodes } from "@/lib/spiral-nodes";

interface SpiralSceneProps {
  searchQuery: string;
  exploreNonce: number;
  zoom: number;
  onNodeFocus: (node: ReturnType<typeof layoutSpiral>[number]) => void;
  onNodeOpen: (node: ReturnType<typeof layoutSpiral>[number]) => void;
}

export function SpiralScene({
  searchQuery,
  exploreNonce,
  zoom,
  onNodeFocus,
  onNodeOpen,
}: SpiralSceneProps) {
  const cloudRef = useRef<Group>(null);
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
      <color attach="background" args={["#dcdcde"]} />
      <fog attach="fog" args={["#dcdcde", 8, 32]} />
      <ambientLight intensity={1.15} />

      <group ref={cloudRef}>
        <Suspense fallback={null}>
          {nodes.map((node) => (
            <SpiralImageTile
              key={node.id}
              node={node}
              dimmed={hasFilter && !matchedIds.has(node.id)}
              highlighted={hasFilter && matchedIds.has(node.id)}
              onFocus={onNodeFocus}
              onOpen={onNodeOpen}
            />
          ))}
        </Suspense>
      </group>

      <SpiralSootCamera
        cloudRef={cloudRef}
        focusNode={focusNode}
        exploreNonce={exploreNonce}
        zoom={zoom}
      />
    </>
  );
}
