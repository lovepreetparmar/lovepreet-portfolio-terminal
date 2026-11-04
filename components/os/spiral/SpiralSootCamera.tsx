"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { MathUtils, Vector3 } from "three";
import type { PositionedSpiralNode } from "@/lib/spiral-layout";

interface SpiralSootCameraProps {
  focusNode: PositionedSpiralNode | null;
  exploreNonce: number;
  zoom: number;
  tight?: boolean;
}

const desired = new Vector3();
const look = new Vector3();
const radial = new Vector3();

export function SpiralSootCamera({
  focusNode,
  exploreNonce,
  zoom,
  tight = false,
}: SpiralSootCameraProps) {
  const { camera } = useThree();
  const azimuth = useRef(0.4);
  const explore = useRef(0);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    explore.current += 0.55;
  }, [exploreNonce, reducedMotion]);

  useFrame((state, delta) => {
    const pointer = state.pointer;
    const idle = reducedMotion || tight ? 0 : state.clock.elapsedTime * 0.045;
    const sway = tight ? 0.08 : 0.42;
    const nextAzimuth = idle + pointer.x * sway + explore.current;
    azimuth.current = MathUtils.damp(azimuth.current, nextAzimuth, tight ? 2.4 : 1.5, delta);

    if (focusNode && tight) {
      radial.set(focusNode.position[0], 0, focusNode.position[2]);

      if (radial.lengthSq() < 1e-4) {
        radial.set(0, 0, 1);
      }

      radial.normalize();
      desired.set(
        focusNode.position[0] + radial.x * 1.45,
        focusNode.position[1] + 0.18,
        focusNode.position[2] + radial.z * 1.45,
      );
      look.set(focusNode.position[0], focusNode.position[1], focusNode.position[2]);
    } else {
      const radius = focusNode ? Math.min(zoom, 4.4) : zoom;
      desired.set(
        Math.sin(azimuth.current) * radius,
        focusNode ? focusNode.position[1] + 0.45 : 0.9 + pointer.y * 0.22,
        Math.cos(azimuth.current) * radius,
      );

      if (focusNode) {
        look.set(focusNode.position[0], focusNode.position[1], focusNode.position[2]);
      } else {
        look.set(pointer.x * 0.18, -0.15, pointer.y * 0.08);
      }
    }

    const follow = tight ? 3.4 : 2.2;
    camera.position.lerp(desired, 1 - Math.exp(-follow * delta));
    camera.lookAt(look);
  });

  return null;
}
