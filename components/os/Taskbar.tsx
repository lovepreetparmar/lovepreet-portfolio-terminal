"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AppTile } from "@/components/os/AppGlyph";
import { StartMenu } from "@/components/os/StartMenu";
import { TASKBAR_HEIGHT } from "@/lib/constants";
import { DESKTOP_APPS } from "@/lib/apps";
import { useOSStore } from "@/store/useOSStore";

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
};

function subscribeToClock(onChange: () => void) {
  const id = window.setInterval(onChange, 1000);
  return () => window.clearInterval(id);
}

function readClock() {
  return new Date().toLocaleTimeString("en-US", timeFormat);
}

function Clock() {
  const time = useSyncExternalStore(subscribeToClock, readClock, () => "--:-- --");

  return (
    <time dateTime={time} className="min-w-[4.75rem] text-right tabular-nums sm:min-w-[5.5rem]">
      {time}
    </time>
  );
}

export function Taskbar() {
  const windows = useOSStore((state) => state.windows);
  const activeWindowId = useOSStore((state) => state.activeWindowId);
  const openWindow = useOSStore((state) => state.openWindow);
  const focusWindow = useOSStore((state) => state.focusWindow);
  const minimizeWindow = useOSStore((state) => state.minimizeWindow);
  const [menuOpen, setMenuOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!launcherRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const launch = (id: string) => {
    openWindow(id);
    setMenuOpen(false);
  };

  const onTaskbarAppClick = (id: string) => {
    const osWindow = windows[id];

    if (!osWindow) {
      return;
    }

    if (!osWindow.isOpen || osWindow.isMinimized) {
      openWindow(id);
      return;
    }

    if (activeWindowId === id) {
      minimizeWindow(id);
      return;
    }

    focusWindow(id);
  };

  return (
    <footer
      className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-1.5 border-t border-white/10 bg-zinc-950/55 px-2 backdrop-blur-2xl sm:gap-2 sm:px-3"
      style={{ height: TASKBAR_HEIGHT }}
    >
      <div ref={launcherRef} className="relative">
        <button
          type="button"
          aria-label="LP launcher"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className={`flex items-center gap-2 rounded-xl px-1.5 py-1 outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
            menuOpen ? "bg-white/15" : "hover:bg-white/10"
          }`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-400 to-sky-500 text-[11px] font-semibold tracking-wide text-white">
            LP
          </span>
          <span className="hidden pr-1.5 text-sm font-medium text-white/90 sm:inline">
            LP
          </span>
        </button>
        {menuOpen ? <StartMenu onLaunch={launch} /> : null}
      </div>

      <span className="mx-1 h-6 w-px bg-white/15" aria-hidden="true" />

      <div className="flex items-center gap-1">
        {DESKTOP_APPS.map((app) => {
          const osWindow = windows[app.id];
          const isOpen = osWindow?.isOpen ?? false;
          const isActive =
            isOpen && !osWindow?.isMinimized && activeWindowId === app.id;

          return (
            <button
              key={app.id}
              type="button"
              aria-label={app.title}
              aria-pressed={isActive}
              onClick={() => onTaskbarAppClick(app.id)}
              className={`flex w-10 flex-col items-center rounded-xl px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-white/70 sm:w-12 ${
                isActive ? "bg-white/15" : "hover:bg-white/10"
              }`}
            >
              <AppTile name={app.icon} className="h-7 w-7 rounded-lg" />
              <span
                className={`mt-1 h-1 w-1 rounded-full ${
                  isActive ? "bg-white" : isOpen ? "bg-white/55" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-2 pr-0.5 text-xs text-white/80 sm:gap-3 sm:pr-1">
        <span className="hidden items-center gap-2 sm:flex" aria-label="System status">
          <WifiIcon />
          <BatteryIcon />
        </span>
        <Clock />
      </div>
    </footer>
  );
}

function WifiIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M5 10.5c4-3.4 10-3.4 14 0" />
      <path d="M8 13.5c2.3-1.9 5.7-1.9 8 0" />
      <path d="M12 17.25h.01" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="2.75" y="7.5" width="16.5" height="9" rx="1.6" />
      <path d="M21 10.5v3" strokeLinecap="round" />
      <rect x="4.5" y="9.25" width="9" height="5.5" rx="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
