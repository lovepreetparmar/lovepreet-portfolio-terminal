"use client";

import { useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { APP_COMPONENTS } from "@/components/apps/registry";
import { AppGlyph } from "@/components/os/AppGlyph";
import { useOSStore } from "@/store/useOSStore";
import type { OSWindow } from "@/types/os";

interface WindowFrameProps {
  osWindow: OSWindow;
  isActive: boolean;
  compact?: boolean;
}

export function WindowFrame({ osWindow, isActive, compact = false }: WindowFrameProps) {
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

    if (osWindow.isMaximized || compact) {
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
      // Capture can fail if the pointer is already gone.
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
      className={`lp-window-in lp-window-shell lp-spiral-window pointer-events-auto absolute flex flex-col overflow-hidden rounded-[var(--lp-radius-window)] border transition-[box-shadow,opacity] duration-[var(--lp-duration-fast)] ${
        isActive ? "lp-window-shell--active opacity-100" : "opacity-[0.96]"
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
        className={`relative flex h-9 shrink-0 touch-none items-center border-b border-neutral-200 bg-neutral-50 px-3 ${
          compact || isDragging ? "cursor-default" : "cursor-grab"
        } ${isDragging ? "cursor-grabbing" : ""}`}
      >
        <WindowControls
          isMaximized={osWindow.isMaximized}
          onClose={() => closeWindow(osWindow.id)}
          onMinimize={() => minimizeWindow(osWindow.id)}
          onMaximize={() => toggleMaximize(osWindow.id)}
        />
        <div
          id={titleId}
          className="pointer-events-none absolute inset-x-12 flex items-center justify-center gap-1.5"
        >
          <AppGlyph
            name={osWindow.icon}
            className={`h-3 w-3 ${isActive ? "text-neutral-700" : "text-neutral-400"}`}
          />
          <span
            className={`truncate text-[11px] tracking-wide uppercase ${
              isActive ? "text-neutral-800" : "text-neutral-400"
            }`}
          >
            {osWindow.title}
          </span>
        </div>
      </header>
      <div className="lp-window-body min-h-0 flex-1 select-text overflow-hidden">
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
    <div className="group/controls relative z-10 flex items-center gap-1">
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
      className="flex h-4 w-4 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      <span
        className={`flex h-3 w-3 items-center justify-center rounded-full ${tone}`}
      >
        <svg
          viewBox="0 0 14 14"
          className="h-2 w-2 text-black/70 opacity-0 group-hover/controls:opacity-100"
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
