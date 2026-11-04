import type { SpiralNodeData } from "@/lib/spiral-nodes";

export interface PositionedSpiralNode extends SpiralNodeData {
  position: [number, number, number];
  scale: number;
  rotation: number;
  index: number;
  layer: number;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Inner-shell radius. The camera sits at the origin and looks out at these cells. */
export const SPHERE_RADIUS = 4.75;

/** Even points over the whole sphere, so a full turn shows every skill. */
export function layoutSphere(nodes: SpiralNodeData[]): PositionedSpiralNode[] {
  const count = Math.max(nodes.length, 1);
  const fit = Math.min(1.22, 8.8 / Math.sqrt(count));

  return nodes.map((node, index) => {
    const unitY = count === 1 ? 0 : 1 - (index / (count - 1)) * 2;
    const ring = Math.sqrt(Math.max(0, 1 - unitY * unitY));
    const theta = GOLDEN_ANGLE * index;
    const severalProjects = /^\d+ projects$/.test(node.sublabel) && node.sublabel !== "1 project";

    return {
      ...node,
      position: [
        Math.cos(theta) * ring * SPHERE_RADIUS,
        unitY * SPHERE_RADIUS,
        Math.sin(theta) * ring * SPHERE_RADIUS,
      ],
      scale: (severalProjects ? 1.08 : 1) * fit,
      rotation: 0,
      index,
      layer: 0,
    };
  });
}

const HONEYCOMB_STEP = 0.82;
const HONEYCOMB_START = 1.02;
const HONEYCOMB_GROWTH = 0.042;

/** Rising helix, spaced so a hex prism fits between each step. */
export function layoutHoneycomb(nodes: SpiralNodeData[]): PositionedSpiralNode[] {
  const total = Math.max(nodes.length, 1);
  const mid = (nodes.length - 1) / 2;

  return nodes.map((node, index) => {
    const theta = index * HONEYCOMB_STEP - 0.4;
    const radius = HONEYCOMB_START + index * HONEYCOMB_GROWTH;
    const severalProjects = /^\d+ projects$/.test(node.sublabel) && node.sublabel !== "1 project";
    const layer = index % 3;

    return {
      ...node,
      position: [
        Math.cos(theta) * radius,
        (index - mid) * 0.15 - 0.38,
        Math.sin(theta) * radius + (layer - 1) * 0.08,
      ],
      scale: severalProjects ? 1 : 0.88,
      rotation: 0,
      index,
      layer,
    };
  });
}

export function layoutSpiral(nodes: SpiralNodeData[]): PositionedSpiralNode[] {
  const total = Math.max(nodes.length, 1);

  return nodes.map((node, index) => {
    const progress = index / total;
    const turns = 2.15;
    const theta = progress * Math.PI * 2 * turns + 0.4;
    const radius = 0.25 + progress * 2.7;
    const layer = index % 3;
    const y = (progress - 0.45) * 2.2 + Math.sin(theta * 1.4) * 0.18;
    const featured = node.sublabel === "Featured";

    return {
      ...node,
      position: [
        Math.cos(theta) * radius,
        y,
        Math.sin(theta) * radius + (layer - 1) * 0.28,
      ],
      scale: (featured ? 1.28 : 1.05) - progress * 0.22,
      rotation: 0,
      index,
      layer,
    };
  });
}
