"use client";

import { buildSpiralNodes, filterSpiralNodes } from "@/lib/spiral-nodes";

interface SpiralMobileExploreProps {
  searchQuery: string;
  onSelectCraft: (craftId: string) => void;
}

export function SpiralMobileExplore({ searchQuery, onSelectCraft }: SpiralMobileExploreProps) {
  const nodes = filterSpiralNodes(buildSpiralNodes(), searchQuery);

  return (
    <div className="absolute inset-0 z-[2] overflow-auto bg-[#efe6da] px-4 pb-32 pt-36">
      <ul className="mx-auto grid max-w-lg gap-3 sm:grid-cols-2">
        {nodes.map((node) => (
          <li key={node.id}>
            <button
              type="button"
              onClick={() => onSelectCraft(node.id)}
              className="lp-focus-ring w-full rounded-2xl px-4 py-5 text-left"
              style={{ background: node.palette.bg, color: node.palette.ink }}
            >
              <p className="text-[10px] tracking-[0.28em] uppercase opacity-70">{node.sublabel}</p>
              <p className="lp-editorial-display mt-2 text-3xl">{node.label}</p>
            </button>
          </li>
        ))}
      </ul>
      {nodes.length === 0 ? (
        <p className="text-center text-sm text-[#5c5148]">No matching language or tool.</p>
      ) : null}
    </div>
  );
}
