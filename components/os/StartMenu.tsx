"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppTile } from "@/components/os/AppGlyph";
import { DESKTOP_APPS } from "@/lib/apps";

interface StartMenuProps {
  onLaunch: (id: string) => void;
}

export function StartMenu({ onLaunch }: StartMenuProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const apps = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return DESKTOP_APPS;
    }

    return DESKTOP_APPS.filter(
      (app) =>
        app.title.toLowerCase().includes(normalized) ||
        app.id.includes(normalized),
    );
  }, [query]);

  return (
    <div
      role="menu"
      aria-label="Applications"
      className="absolute bottom-[calc(100%+10px)] left-0 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.12)]"
    >
      <div className="border-b border-neutral-200 px-3 py-3">
        <p className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase">LP OS</p>
        <p className="mt-1 text-sm font-medium text-neutral-900">Applications</p>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter apps…"
          aria-label="Filter applications"
          className="lp-spiral-search lp-focus-ring mt-3 w-full text-sm"
        />
      </div>
      <ul className="max-h-64 overflow-auto p-2">
        {apps.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-neutral-500">No matches.</li>
        ) : (
          apps.map((app) => (
            <li key={app.id}>
              <button
                type="button"
                role="menuitem"
                onClick={() => onLaunch(app.id)}
                className="lp-focus-ring flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-neutral-50 focus-visible:bg-neutral-50"
              >
                <AppTile name={app.icon} className="h-9 w-9 border-neutral-200 bg-neutral-50" />
                <span className="text-sm text-neutral-900">{app.title}</span>
              </button>
            </li>
          ))
        )}
      </ul>
      <div className="border-t border-neutral-200 px-3 py-2 text-[10px] text-neutral-400">
        Esc to close
      </div>
    </div>
  );
}
