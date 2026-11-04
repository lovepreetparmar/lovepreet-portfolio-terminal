"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { CanvasTexture, DoubleSide, Group, SRGBColorSpace } from "three";
import { createSpiralTileCanvas } from "@/lib/spiral-texture";
import type { PositionedSpiralNode } from "@/lib/spiral-layout";

interface SpiralImageTileProps {
  node: PositionedSpiralNode;
  dimmed?: boolean;
  highlighted?: boolean;
  onHover: (node: PositionedSpiralNode | null) => void;
  onOpen: (node: PositionedSpiralNode) => void;
}

const CARD_HEIGHT = 1.85;
const CARD_WIDTH = 1.48;

export function SpiralImageTile({
  node,
  dimmed = false,
  highlighted = false,
  onHover,
  onOpen,
}: SpiralImageTileProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => {
    const canvas = createSpiralTileCanvas(node.palette, node.label, node.sublabel);
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, [node.palette, node.label, node.sublabel]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    group.lookAt(state.camera.position);

    const time = state.clock.elapsedTime;
    const float = Math.sin(time * 0.7 + node.index) * 0.045;
    group.position.set(node.position[0], node.position[1] + float, node.position[2]);

    let target = node.scale;
    if (!dimmed && (hovered || highlighted)) {
      target *= hovered ? 1.16 : 1.08;
    }

    const current = group.scale.x;
    group.scale.setScalar(current + (target - current) * Math.min(1, delta * 6));
  });

  return (
    <group ref={groupRef} position={node.position} scale={node.scale}>
      <mesh position={[0.06, -0.08, -0.04]}>
        <planeGeometry args={[CARD_WIDTH + 0.05, CARD_HEIGHT + 0.05]} />
        <meshBasicMaterial color="#2a2118" transparent opacity={dimmed ? 0.04 : 0.22} />
      </mesh>
      <mesh
        onPointerOver={(event) => {
          event.stopPropagation();
          if (dimmed) {
            return;
          }

          setHovered(true);
          onHover(node);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
          document.body.style.cursor = "default";
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (!dimmed) {
            onOpen(node);
          }
        }}
      >
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={dimmed ? 0.16 : 1}
          side={DoubleSide}
          depthWrite={!dimmed}
        />
      </mesh>
    </group>
  );
}
