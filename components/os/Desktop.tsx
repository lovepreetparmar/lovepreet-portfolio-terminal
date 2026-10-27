"use client";

import { useEffect, useMemo, useState } from "react";
import { DesktopIcon } from "@/components/os/DesktopIcon";
import { Taskbar } from "@/components/os/Taskbar";
import { WindowFrame } from "@/components/os/WindowFrame";
import { TASKBAR_HEIGHT } from "@/lib/constants";
import { DESKTOP_APPS } from "@/lib/apps";
import { useOSStore } from "@/store/useOSStore";

export function Desktop() {
  const windows = useOSStore((state) => state.windows);
  const activeWindowId = useOSStore((state) => state.activeWindowId);
  const openWindow = useOSStore((state) => state.openWindow);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => useOSStore.getState().syncMaximizedToViewport();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const openWindows = useMemo(
    () =>
      Object.values(windows)
        .filter((osWindow) => osWindow.isOpen && !osWindow.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex),
    [windows],
  );

  return (
    <div
      className="relative h-screen w-screen overflow-hidden select-none text-zinc-100"
      onPointerDown={() => setSelectedId(null)}
    >
      <div className="lp-wallpaper absolute inset-0" />
      <div className="pointer-events-none absolute right-8 top-7 text-right">
        <p className="text-[11px] font-medium tracking-[0.42em] text-white/35">
          LP OS
        </p>
      </div>

      <div
        className="absolute left-0 top-0 grid content-start p-3"
        style={{
          bottom: TASKBAR_HEIGHT,
          gridTemplateRows: "repeat(auto-fill, 108px)",
          gridAutoFlow: "column",
          gridAutoColumns: "100px",
        }}
      >
        {DESKTOP_APPS.map((app) => (
          <DesktopIcon
            key={app.id}
            app={app}
            selected={selectedId === app.id}
            onSelect={() => setSelectedId(app.id)}
            onOpen={() => openWindow(app.id)}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{ bottom: TASKBAR_HEIGHT }}
      >
        {openWindows.map((osWindow) => (
          <WindowFrame
            key={osWindow.id}
            osWindow={osWindow}
            isActive={activeWindowId === osWindow.id}
          />
        ))}
      </div>

      <Taskbar />
    </div>
  );
}
