"use client";

import { AppTile } from "@/components/os/AppGlyph";
import type { DesktopApp } from "@/types/os";

interface DesktopIconProps {
  app: DesktopApp;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
}

export function DesktopIcon({
  app,
  selected,
  onSelect,
  onOpen,
}: DesktopIconProps) {
  return (
    <button
      type="button"
      data-app-id={app.id}
      aria-pressed={selected}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(event) => {
        event.stopPropagation();
        onOpen();
      }}
      className={`flex h-[104px] w-[92px] flex-col items-center gap-1.5 rounded-xl px-1.5 py-2 text-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/70 ${
        selected ? "bg-white/15 ring-1 ring-white/30" : "hover:bg-white/10"
      }`}
    >
      <AppTile name={app.icon} className="h-12 w-12 rounded-2xl" />
      <span className="line-clamp-2 text-center text-[11px] font-medium leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
        {app.title}
      </span>
    </button>
  );
}
