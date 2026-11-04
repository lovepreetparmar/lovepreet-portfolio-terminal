"use client";

import { useMemo } from "react";
import { CraftMark } from "@/components/spiral/CraftMark";
import { filterSpiralNodes, type SpiralNodeData } from "@/lib/spiral-nodes";

interface HoneycombProps {
  nodes: SpiralNodeData[];
  searchQuery: string;
  onOpen: (craftId: string) => void;
}

export function Honeycomb({ nodes, searchQuery, onOpen }: HoneycombProps) {
  const matchedIds = useMemo(() => {
    return new Set(filterSpiralNodes(nodes, searchQuery).map((node) => node.id));
  }, [nodes, searchQuery]);
  const filtering = searchQuery.trim().length > 0;
  const placed = useMemo(() => layoutCells(nodes), [nodes]);

  return (
    <div className="lp-honeycomb absolute inset-0 z-[1]" aria-label="Languages and tools">
      <div className="lp-honeycomb-cluster">
        {placed.map(({ node, x, y, width, height }) => {
          const dimmed = filtering && !matchedIds.has(node.id);
          const matched = filtering && matchedIds.has(node.id);

          return (
            <button
              key={node.id}
              type="button"
              className={`lp-hex${dimmed ? " is-dim" : ""}${matched ? " is-match" : ""}`}
              style={{
                width,
                height,
                left: x,
                top: y,
                ["--hex-fill" as string]: node.palette.bg,
                ["--hex-ink" as string]: node.palette.ink,
              }}
              aria-label={`${node.label}. ${node.sublabel}`}
              onClick={() => {
                if (!dimmed) {
                  onOpen(node.id);
                }
              }}
            >
              <CraftMark id={node.id} />
              <span className="lp-hex-label">
                <span className="lp-editorial-display lp-hex-name">{node.label}</span>
                <span className="lp-hex-sub">{node.sublabel}</span>
              </span>
            </button>
          );
        })}
      </div>
      {filtering && matchedIds.size === 0 ? (
        <p className="absolute inset-x-0 bottom-[18%] text-center text-sm text-[#5c5148]">
          No matching language or tool.
        </p>
      ) : null}
    </div>
  );
}

const ROW_PATTERN = [3, 4, 3, 4, 3];

function layoutCells(nodes: SpiralNodeData[]) {
  const size = 52;
  const width = Math.sqrt(3) * size;
  const height = 2 * size;
  const gap = 1.045;
  const stepX = width * gap;
  const stepY = height * 0.75 * gap;
  const points: Array<{ x: number; y: number }> = [];
  let cursor = 0;

  ROW_PATTERN.forEach((count, row) => {
    for (let column = 0; column < count && cursor < nodes.length; column += 1) {
      points.push({
        x: (column - (count - 1) / 2) * stepX,
        y: (row - (ROW_PATTERN.length - 1) / 2) * stepY,
      });
      cursor += 1;
    }
  });

  while (points.length < nodes.length) {
    const extra = points.length - ROW_PATTERN.reduce((sum, count) => sum + count, 0);
    points.push({
      x: (extra - 1) * stepX,
      y: ((ROW_PATTERN.length - 1) / 2 + 1) * stepY,
    });
  }

  return nodes.map((node, index) => {
    const point = points[index] ?? { x: 0, y: 0 };
    return {
      node,
      width,
      height,
      x: point.x - width / 2,
      y: point.y - height / 2,
    };
  });
}
