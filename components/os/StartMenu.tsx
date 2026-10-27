"use client";

import { AppTile } from "@/components/os/AppGlyph";
import { DESKTOP_APPS } from "@/lib/apps";

interface StartMenuProps {
  onLaunch: (id: string) => void;
}

export function StartMenu({ onLaunch }: StartMenuProps) {
  return (
    <div
      role="menu"
      aria-label="Applications"
      className="absolute bottom-[calc(100%+10px)] left-0 w-72 rounded-2xl border border-white/15 bg-zinc-900/75 p-2 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="px-3 pb-1 pt-2">
        <p className="text-[11px] font-medium tracking-[0.22em] text-white/40">
          LP OS
        </p>
        <p className="text-sm font-medium text-white/90">Applications</p>
      </div>
      <ul className="mt-1">
        {DESKTOP_APPS.map((app) => (
          <li key={app.id}>
            <button
              type="button"
              role="menuitem"
              onClick={() => onLaunch(app.id)}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left outline-none hover:bg-white/10 focus-visible:bg-white/10"
            >
              <AppTile name={app.icon} className="h-9 w-9 rounded-xl" />
              <span className="text-sm text-white/90">{app.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
