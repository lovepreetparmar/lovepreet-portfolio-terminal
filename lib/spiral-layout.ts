import type { SpiralNodeData } from "@/lib/spiral-nodes";

export interface PositionedSpiralNode extends SpiralNodeData {
  position: [number, number, number];
  scale: number;
  rotation: number;
  index: number;
  layer: number;
}

export function spiralPathSample(count: number): [number, number, number][] {
  const points: [number, number, number][] = [];

  for (let index = 0; index < count; index += 1) {
    points.push(spiralPoint(index, count, 0));
  }

  return points;
}

function spiralPoint(
  index: number,
  total: number,
  layer: number,
): [number, number, number] {
  const t = index * 0.48 + layer * 0.35 + 0.2;
  const radius = 1.6 + index * 0.26 + layer * 0.45;
  const y = index * 0.17 - total * 0.08 + Math.sin(index * 0.55 + layer) * 0.42;
  const jitterX = Math.sin(index * 1.7 + layer * 2.1) * 0.22;
  const jitterZ = Math.cos(index * 1.3 + layer * 1.8) * 0.22;

  return [
    Math.cos(t) * radius + jitterX,
    y,
    Math.sin(t) * radius + jitterZ,
  ];
}

export function layoutSpiral(nodes: SpiralNodeData[]): PositionedSpiralNode[] {
  const total = nodes.length;
  const positioned: PositionedSpiralNode[] = [];

  nodes.forEach((node, index) => {
    const layer = index % 2;
    const [x, y, z] = spiralPoint(index, total, layer);
    const t = index * 0.48 + layer * 0.35 + 0.2;
    const featured = node.sublabel === "Featured";

    positioned.push({
      ...node,
      position: [x, y, z],
      scale: (featured ? 1.15 : 0.92) + (index % 3) * 0.05,
      rotation: -t * 0.1,
      index,
      layer,
    });
  });

  return positioned;
}
