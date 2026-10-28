"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, DoubleSide, SRGBColorSpace, type Mesh } from "three";
import { createSpiralTileCanvas } from "@/lib/spiral-texture";
import type { PositionedSpiralNode } from "@/lib/spiral-layout";

interface SpiralImageTileProps {
  node: PositionedSpiralNode;
  dimmed?: boolean;
  highlighted?: boolean;
  onFocus: (node: PositionedSpiralNode) => void;
  onOpen: (node: PositionedSpiralNode) => void;
}

export function SpiralImageTile({
  node,
  dimmed = false,
  highlighted = false,
  onFocus,
  onOpen,
}: SpiralImageTileProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    const canvas = createSpiralTileCanvas(node.visual, node.label, node.sublabel);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    return tex;
  }, [node.visual, node.label, node.sublabel]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;

    if (!mesh) {
      return;
    }

    mesh.lookAt(state.camera.position);

    const enter = Math.min(1, Math.max(0, state.clock.elapsedTime - node.index * 0.05) / 0.45);
    let targetScale = node.scale * (0.65 + enter * 0.35);
    if (hovered && !dimmed) {
      targetScale *= 1.06;
    }
    if (highlighted) {
      targetScale *= 1.1;
    }

    const current = mesh.scale.x;
    mesh.scale.setScalar(current + (targetScale - current) * Math.min(1, delta * 8));

    const material = mesh.material as { opacity: number };
    material.opacity = dimmed ? 0.12 : highlighted ? 1 : 0.96;
  });

  const aspect = 0.8;
  const height = 1.05;

  return (
    <mesh
      ref={meshRef}
      position={node.position}
      rotation={[0, node.rotation, 0]}
      scale={0.01}
      onPointerOver={(event) => {
        event.stopPropagation();
        if (!dimmed) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (!dimmed) {
          onFocus(node);
        }
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        if (!dimmed) {
          onOpen(node);
        }
      }}
    >
      <planeGeometry args={[height * aspect, height]} />
      <meshBasicMaterial map={texture} transparent side={DoubleSide} depthWrite={!dimmed} />
    </mesh>
  );
}
