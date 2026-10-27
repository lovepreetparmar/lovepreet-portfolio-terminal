"use client";

import { useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { APP_COMPONENTS } from "@/components/apps/registry";
import { AppGlyph } from "@/components/os/AppGlyph";
import { useOSStore } from "@/store/useOSStore";
import type { OSWindow } from "@/types/os";

interface WindowFrameProps {
  osWindow: OSWindow;
  isActive: boolean;
}

export function WindowFrame({ osWindow, isActive }: WindowFrameProps) {
  const focusWindow = useOSStore((state) => state.focusWindow);
  const closeWindow = useOSStore((state) => state.closeWindow);
  const minimizeWindow = useOSStore((state) => state.minimizeWindow);
  const toggleMaximize = useOSStore((state) => state.toggleMaximize);
  const updatePosition = useOSStore((state) => state.updatePosition);
  const [isDragging, setIsDragging] = useState(false);
  const AppComponent = APP_COMPONENTS[osWindow.componentId];
  const titleId = `${osWindow.id}-window-title`;

  const onHeaderPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0) {
      return;
    }

    const target = event.target as HTMLElement;
    if (target.closest("[data-window-control]")) {
      return;
    }

    if (osWindow.isMaximized) {
      return;
    }

    const handle = event.currentTarget;
    const startX = event.clientX;
    const startY = event.clientY;
    const originX = osWindow.position.x;
    const originY = osWindow.position.y;

    try {
      handle.setPointerCapture(event.pointerId);
    } catch {
      // Capture can fail if the pointer is already gone. Move listeners still track the drag.
    }

    setIsDragging(true);

    const onMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return;
      }

      updatePosition(osWindow.id, originX + dx, originY + dy);
    };

    const onUp = () => {
      setIsDragging(false);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
      handle.removeEventListener("pointercancel", onUp);
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
    handle.addEventListener("pointercancel", onUp);
  };

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      data-window-id={osWindow.id}
      onPointerDown={() => focusWindow(osWindow.id)}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("[data-window-control]")) {
          return;
        }

        event.currentTarget
          .querySelector<HTMLInputElement>("[data-terminal-input]")
          ?.focus();
      }}
      style={{
        left: osWindow.position.x,
        top: osWindow.position.y,
        width: osWindow.size.width,
        height: osWindow.size.height,
        zIndex: osWindow.zIndex,
      }}
      className={`lp-window-in pointer-events-auto absolute flex flex-col overflow-hidden rounded-xl border shadow-[0_24px_70px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-2xl ${
        isActive
          ? "border-white/25 bg-zinc-900/70"
          : "border-white/10 bg-zinc-900/55"
      } ${isDragging ? "cursor-grabbing" : ""}`}
    >
      <header
        role="group"
        aria-label={`${osWindow.title} title bar`}
        onPointerDown={onHeaderPointerDown}
        onDoubleClick={(event) => {
          if ((event.target as HTMLElement).closest("[data-window-control]")) {
            return;
          }
          toggleMaximize(osWindow.id);
        }}
        className={`relative flex h-11 shrink-0 touch-none items-center px-3 ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <WindowControls
          isMaximized={osWindow.isMaximized}
          onClose={() => closeWindow(osWindow.id)}
          onMinimize={() => minimizeWindow(osWindow.id)}
          onMaximize={() => toggleMaximize(osWindow.id)}
        />
        <div
          id={titleId}
          className="pointer-events-none absolute inset-x-14 flex items-center justify-center gap-2"
        >
          <AppGlyph
            name={osWindow.icon}
            className={`h-3.5 w-3.5 ${isActive ? "text-white/80" : "text-white/45"}`}
          />
          <span
            className={`truncate text-[13px] font-medium ${
              isActive ? "text-white/90" : "text-white/50"
            }`}
          >
            {osWindow.title}
          </span>
        </div>
      </header>
      <div className="min-h-0 flex-1 select-text overflow-auto">
        {AppComponent ? (
          <AppComponent />
        ) : (
          <p className="p-6 text-sm text-white/60">This app is unavailable.</p>
        )}
      </div>
    </section>
  );
}

function WindowControls({
  isMaximized,
  onClose,
  onMinimize,
  onMaximize,
}: {
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
}) {
  return (
    <div className="group/controls relative z-10 flex items-center gap-1.5">
      <ControlButton label="Close" tone="bg-[#ff5f57]" onClick={onClose}>
        <path d="M4 4l6 6M10 4 4 10" />
      </ControlButton>
      <ControlButton label="Minimize" tone="bg-[#febc2e]" onClick={onMinimize}>
        <path d="M3.5 7h7" />
      </ControlButton>
      <ControlButton
        label={isMaximized ? "Restore" : "Maximize"}
        tone="bg-[#28c840]"
        onClick={onMaximize}
      >
        {isMaximized ? (
          <>
            <rect x="4.25" y="2.75" width="5.5" height="5.5" rx="0.6" />
            <path d="M2.75 5.5v5.75h5.75" />
          </>
        ) : (
          <rect x="3.25" y="3.25" width="7.5" height="7.5" rx="0.8" />
        )}
      </ControlButton>
    </div>
  );
}

function ControlButton({
  label,
  tone,
  onClick,
  children,
}: {
  label: string;
  tone: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      data-window-control
      aria-label={label}
      title={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      onDoubleClick={(event) => event.stopPropagation()}
      className="flex h-5 w-5 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${tone}`}
      >
        <svg
          viewBox="0 0 14 14"
          className="h-2.5 w-2.5 text-black/70 opacity-0 group-hover/controls:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {children}
        </svg>
      </span>
    </button>
  );
}
