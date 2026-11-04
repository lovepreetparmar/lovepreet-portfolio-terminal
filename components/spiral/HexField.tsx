"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { BackSide, NoToneMapping, Vector3, type Mesh } from "three";
import { HexCell, type HexHover } from "@/components/spiral/HexCell";
import { SphereRig } from "@/components/spiral/SphereRig";
import { layoutSphere, SPHERE_RADIUS } from "@/lib/spiral-layout";
import { buildSpiralNodes, filterSpiralNodes } from "@/lib/spiral-nodes";

interface HexFieldProps {
  searchQuery: string;
  focusId: string | null;
  tight: boolean;
  compact: boolean;
  interactive: boolean;
  onOpen: (craftId: string) => void;
}

export function HexField({
  searchQuery,
  focusId,
  tight,
  compact,
  interactive,
  onOpen,
}: HexFieldProps) {
  return (
    <div
      id="lp-hex-field"
      className={`lp-spiral-stage lp-hex-field absolute inset-0 z-[1] touch-none ${interactive ? "" : "pointer-events-none"}`}
      aria-label="Language sphere. Drag to look around, scroll to zoom out and see it from outside, click a cell to open it."
    >
      <Canvas
        camera={{ position: [0, 0, 21], fov: compact ? 45 : 40, near: 0.08, far: 90 }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          toneMapping: NoToneMapping,
        }}
      >
        <HexScene
          searchQuery={searchQuery}
          focusId={focusId}
          tight={tight}
          compact={compact}
          interactive={interactive}
          onOpen={onOpen}
        />
      </Canvas>
    </div>
  );
}

function HexScene({
  searchQuery,
  focusId,
  tight,
  compact,
  interactive,
  onOpen,
}: {
  searchQuery: string;
  focusId: string | null;
  tight: boolean;
  compact: boolean;
  interactive: boolean;
  onOpen: (craftId: string) => void;
}) {
  const hover = useRef<HexHover>({ id: null, position: new Vector3() });
  const nodes = useMemo(() => layoutSphere(buildSpiralNodes()), []);
  const matchedIds = useMemo(() => {
    return new Set(filterSpiralNodes(nodes, searchQuery).map((node) => node.id));
  }, [nodes, searchQuery]);
  const hasFilter = searchQuery.trim().length > 0;
  const focusNode = useMemo(() => {
    if (focusId) {
      return nodes.find((node) => node.id === focusId) ?? null;
    }

    if (!hasFilter || matchedIds.size !== 1) {
      return null;
    }

    const onlyId = [...matchedIds][0];
    return nodes.find((node) => node.id === onlyId) ?? null;
  }, [focusId, hasFilter, matchedIds, nodes]);

  return (
    <>
      <color attach="background" args={["#e4d9cc"]} />
      <hemisphereLight args={["#fff8f1", "#cbb9a4", 0.85]} />
      <ambientLight intensity={0.35} color="#fff4ea" />
      <directionalLight position={[5, 8, 14]} intensity={2.1} color="#fff7ee" />
      <directionalLight position={[-8, -3, 6]} intensity={0.45} color="#f0e0cc" />
      <pointLight position={[0, 0.2, 0]} intensity={2.2} distance={16} color="#fff1df" />

      <SphereRig focusNode={focusNode} tight={tight} compact={compact}>
        <InnerShell />

        {nodes.map((node) => (
          <HexCell
            key={node.id}
            node={node}
            dimmed={hasFilter && !matchedIds.has(node.id)}
            highlighted={hasFilter && matchedIds.has(node.id)}
            selected={focusNode?.id === node.id}
            interactive={interactive}
            hover={hover}
            onOpen={onOpen}
          />
        ))}
      </SphereRig>
    </>
  );
}

function InnerShell() {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;

    if (mesh) {
      mesh.visible = state.camera.position.length() < SPHERE_RADIUS;
    }
  });

  return (
    <mesh ref={ref} raycast={() => null}>
      <sphereGeometry args={[SPHERE_RADIUS + 0.55, 64, 48]} />
      <meshBasicMaterial color="#ddd2c4" side={BackSide} />
    </mesh>
  );
}

