"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { MathUtils, Vector3 } from "three";
import type { PositionedSpiralNode } from "@/lib/spiral-layout";

interface SpiralSootCameraProps {
  cloudRef: React.RefObject<Group | null>;
  focusNode: PositionedSpiralNode | null;
  exploreNonce: number;
  zoom: number;
}

const lookTarget = new Vector3();
const camPos = new Vector3();

export function SpiralSootCamera({
  cloudRef,
  focusNode,
  exploreNonce,
  zoom,
}: SpiralSootCameraProps) {
  const { camera, pointer } = useThree();
  const exploreOffset = useRef(0);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    exploreOffset.current += 0.75 + Math.random() * 0.85;
  }, [exploreNonce, reducedMotion]);

  useFrame((state, delta) => {
    const cloud = cloudRef.current;

    if (cloud) {
      const targetRotY =
        pointer.x * 0.95 +
        exploreOffset.current +
        (reducedMotion ? 0 : state.clock.elapsedTime * 0.018);
      const targetRotX = pointer.y * 0.18;
      cloud.rotation.y = MathUtils.lerp(cloud.rotation.y, targetRotY, delta * 2.2);
      cloud.rotation.x = MathUtils.lerp(cloud.rotation.x, targetRotX, delta * 2.5);
      cloud.position.y = MathUtils.lerp(cloud.position.y, pointer.y * 0.35, delta * 2);
    }

    const radius = zoom;
    const theta = pointer.x * 0.35 + (reducedMotion ? 0 : state.clock.elapsedTime * 0.04);
    const phi = MathUtils.clamp(1.05 + pointer.y * 0.22, 0.75, 1.35);

    if (focusNode) {
      lookTarget.set(...focusNode.position);
      camPos.set(...focusNode.position);
      camPos.z += 3.2;
      camPos.y += 0.6;
      camera.position.lerp(camPos, delta * 2.5);
      camera.lookAt(lookTarget);
      return;
    }

    camPos.setFromSphericalCoords(radius, phi, theta);
    camPos.y += 1.2;
    camera.position.lerp(camPos, delta * 3);
    lookTarget.set(pointer.x * 0.4, pointer.y * 0.25, 0);
    camera.lookAt(lookTarget);
  });

  return null;
}
