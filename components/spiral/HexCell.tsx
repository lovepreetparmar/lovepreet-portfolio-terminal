"use client";

import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import {
  CanvasTexture,
  MathUtils,
  Matrix4,
  Quaternion,
  type Camera,
  type Group,
  type MeshBasicMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { CARD_HEIGHT, cardFaceGeometry, cardGlowGeometry } from "@/lib/hex-geometry";
import type { PositionedSpiralNode } from "@/lib/spiral-layout";
import { createHexFaceCanvas } from "@/lib/spiral-texture";

export interface HexHover {
  id: string | null;
  position: Vector3;
}

interface HexCellProps {
  node: PositionedSpiralNode;
  dimmed: boolean;
  highlighted: boolean;
  selected: boolean;
  interactive: boolean;
  hover: MutableRefObject<HexHover>;
  onOpen: (craftId: string) => void;
}

export function HexCell({
  node,
  dimmed,
  highlighted,
  selected,
  interactive,
  hover,
  onOpen,
}: HexCellProps) {
  const groupRef = useRef<import("three").Group>(null);
  const faceRef = useRef<MeshBasicMaterial>(null);
  const glowRef = useRef<MeshBasicMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const labelOn = useRef(false);
  const reducedMotion = useRef(false);
  const rest = useRef(new Vector3(node.position[0], node.position[1], node.position[2]));
  const outward = useRef(new Vector3(0, 0, 1));
  const scratch = useRef(new Vector3());
  const away = useRef(new Vector3());
  const pointerDown = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rest.current.set(node.position[0], node.position[1], node.position[2]);
    outward.current.copy(rest.current);

    if (outward.current.lengthSq() > 1e-6) {
      outward.current.normalize();
    } else {
      outward.current.set(0, 0, 1);
    }
  }, [node.position]);

  const texture = useMemo(() => {
    const canvas = createHexFaceCanvas(node.palette, node.id, node.label);
    const map = new CanvasTexture(canvas);
    map.colorSpace = SRGBColorSpace;
    map.anisotropy = 8;
    return map;
  }, [node.id, node.label, node.palette]);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    const reduced = reducedMotion.current;
    const elapsed = state.clock.elapsedTime;
    const delay = node.index * 0.055;
    const raw = reduced ? 1 : Math.min(1, Math.max(0, (elapsed - delay) / 0.8));
    const appear = raw * raw * (3 - 2 * raw);
    const pos = scratch.current;
    pos.copy(rest.current).multiplyScalar(reduced ? 1 : 0.22 + 0.78 * appear);

    if (!reduced) {
      pos.addScaledVector(outward.current, Math.sin(elapsed * 0.75 + node.index) * 0.04 * appear);
    }

    const active = !dimmed;
    const hoveredSelf = hovered && active;
    const selectedSelf = selected && active;
    let scale = node.scale * (0.55 + 0.45 * appear);

    if (!active) {
      scale *= 0.78;
    } else if (selectedSelf) {
      scale *= 1.34;
    } else if (hoveredSelf) {
      scale *= 1.26;
    } else if (highlighted) {
      scale *= 1.06;
    }

    const hoverId = hover.current.id;

    if (hoverId && hoverId !== node.id && active && appear > 0.92) {
      away.current.copy(rest.current).sub(hover.current.position);
      const distance = away.current.length();

      if (distance > 0.001 && distance < 3.6) {
        pos.addScaledVector(away.current, ((3.6 - distance) * 0.08) / distance);
        scale *= 0.96;
      }
    }

    const lift = !active ? -0.12 : selectedSelf ? 0.72 : hoveredSelf ? 0.42 : highlighted ? 0.14 : 0;

    if (Math.abs(lift) > 0.001 && group.parent) {
      group.parent.updateWorldMatrix(true, false);
      group.parent.getWorldQuaternion(liftQuat);
      liftWorld.copy(rest.current).applyQuaternion(liftQuat);
      liftDir.copy(state.camera.position).sub(liftWorld);

      if (liftDir.lengthSq() > 1e-6) {
        liftDir.normalize().applyQuaternion(liftQuat.invert());
        pos.addScaledVector(liftDir, lift);
      }
    }

    group.position.copy(pos);
    group.updateWorldMatrix(true, false);
    const dist = group.getWorldPosition(depthPoint).distanceTo(state.camera.position);
    const camDist = state.camera.position.length();
    const shell = Math.max(rest.current.length(), 0.001);
    const nearD = Math.abs(camDist - shell);
    const span = camDist + shell - nearD;
    const depthT = span < shell * 0.35 ? 0 : MathUtils.clamp((dist - nearD) / span, 0, 1);
    scale *= MathUtils.lerp(1.14, 0.74, depthT);
    const depthFade = MathUtils.lerp(1, 0.62, depthT);
    const next = group.scale.x + (scale - group.scale.x) * Math.min(1, delta * (reduced ? 18 : 6));
    group.scale.setScalar(Math.max(next, 0.001));
    aimTile(group, state.camera);

    const opacity = (active ? 1 : 0.16) * (0.05 + 0.95 * appear) * depthFade;
    fadeMaterial(faceRef.current, opacity, delta, reduced);
    fadeMaterial(glowRef.current, opacity * (hoveredSelf || selectedSelf ? 0.85 : 0), delta, reduced);
    const order = 2000 - Math.round(dist * 40);
    group.traverse((child) => {
      child.renderOrder = order;
    });

    const show = active && (hoveredSelf || selectedSelf);

    if (show !== labelOn.current) {
      labelOn.current = show;
      setShowLabel(show);
    }
  });

  const detail = node.sublabel;

  return (
    <group ref={groupRef} position={node.position} scale={0.001}>
      <mesh geometry={cardGlowGeometry} position={[0, -0.01, -0.04]} raycast={() => null}>
        <meshBasicMaterial ref={glowRef} color="#e7c9a0" transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh geometry={cardFaceGeometry} raycast={() => null}>
        <meshBasicMaterial
          ref={faceRef}
          map={texture}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh
        geometry={cardFaceGeometry}
        position={[0, 0, 0.02]}
        visible={false}
        onPointerOver={(event) => {
          event.stopPropagation();

          if (!interactive || dimmed) {
            return;
          }

          setHovered(true);
          hover.current.id = node.id;
          hover.current.position.copy(rest.current);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);

          if (hover.current.id === node.id) {
            hover.current.id = null;
          }

          document.body.style.cursor = "";
        }}
        onPointerDown={(event) => {
          pointerDown.current = { x: event.nativeEvent.clientX, y: event.nativeEvent.clientY };
        }}
        onClick={(event) => {
          event.stopPropagation();

          if (!interactive || dimmed || !pointerDown.current) {
            return;
          }

          const dx = event.nativeEvent.clientX - pointerDown.current.x;
          const dy = event.nativeEvent.clientY - pointerDown.current.y;

          if (dx * dx + dy * dy > 64) {
            return;
          }

          onOpen(node.id);
        }}
      />
      {showLabel ? (
        <Html position={[0, CARD_HEIGHT * 0.46, 0.08]} center distanceFactor={4.2} zIndexRange={[20, 0]}>
          <div className="lp-hex-float-label">
            <strong>{node.label}</strong>
            <span>{detail}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

const aimX = new Vector3();
const aimY = new Vector3();
const aimZ = new Vector3();
const aimToCam = new Vector3();
const aimRadial = new Vector3();
const aimQuat = new Quaternion();
const aimParentQuat = new Quaternion();
const aimBasis = new Matrix4();
const liftQuat = new Quaternion();
const liftWorld = new Vector3();
const liftDir = new Vector3();
const depthPoint = new Vector3();

function aimTile(group: Group, camera: Camera) {
  group.updateWorldMatrix(true, false);
  const world = group.getWorldPosition(aimZ);
  aimToCam.copy(camera.position).sub(world);

  if (aimToCam.lengthSq() < 1e-6) {
    return;
  }

  aimToCam.normalize();
  aimRadial.copy(world);

  if (aimRadial.lengthSq() > 1e-6) {
    aimRadial.normalize();
    aimZ.copy(aimToCam).lerp(aimRadial, 0.1).normalize();
  } else {
    aimZ.copy(aimToCam);
  }

  if (aimZ.dot(aimToCam) < 0.92) {
    aimZ.copy(aimToCam);
  }

  aimX.crossVectors(camera.up, aimZ);

  if (aimX.lengthSq() < 1e-6) {
    aimX.set(1, 0, 0);
  }

  aimX.normalize();
  aimY.crossVectors(aimZ, aimX).normalize();
  aimBasis.makeBasis(aimX, aimY, aimZ);
  aimQuat.setFromRotationMatrix(aimBasis);
  setWorldQuaternion(group, aimQuat);
}

function setWorldQuaternion(group: Group, quaternion: Quaternion) {
  const parent = group.parent;

  if (!parent) {
    group.quaternion.copy(quaternion);
    return;
  }

  parent.updateWorldMatrix(true, false);
  parent.getWorldQuaternion(aimParentQuat);
  group.quaternion.copy(aimParentQuat.invert()).multiply(quaternion);
}

function fadeMaterial(
  material: MeshBasicMaterial | null,
  target: number,
  delta: number,
  reduced: boolean,
) {
  if (!material) {
    return;
  }

  const next = reduced
    ? target
    : material.opacity + (target - material.opacity) * Math.min(1, delta * 5);
  material.opacity = next;
  material.transparent = true;
  material.depthWrite = false;
}
