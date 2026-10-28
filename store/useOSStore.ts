"use client";

import { create } from "zustand";
import { DESKTOP_APPS } from "@/lib/apps";
import { isCompactViewport } from "@/lib/compact";
import { clampPosition, fitWindow, maximizedBounds } from "@/lib/viewport";
import type { OSWindow } from "@/types/os";

interface OSState {
  windows: Record<string, OSWindow>;
  maxZIndex: number;
  activeWindowId: string | null;
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  toggleMaximize: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  syncMaximizedToViewport: () => void;
  minimizeAllWindows: () => void;
}

function createRegistry(): Record<string, OSWindow> {
  return Object.fromEntries(
    DESKTOP_APPS.map((app, index) => [
      app.id,
      {
        id: app.id,
        title: app.title,
        icon: app.icon,
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        position: app.defaultPosition,
        size: app.defaultSize,
        zIndex: index + 1,
        componentId: app.componentId,
        restorePosition: null,
        restoreSize: null,
      } satisfies OSWindow,
    ]),
  );
}

function nextActiveId(
  windows: Record<string, OSWindow>,
  excludeId: string,
): string | null {
  const candidates = Object.values(windows).filter(
    (item) => item.isOpen && !item.isMinimized && item.id !== excludeId,
  );

  if (candidates.length === 0) {
    return null;
  }

  return candidates.reduce((top, item) => (item.zIndex > top.zIndex ? item : top))
    .id;
}

function bringToFront(
  state: OSState,
  id: string,
  patch: Partial<OSWindow>,
): Pick<OSState, "windows" | "maxZIndex" | "activeWindowId"> | OSState {
  const current = state.windows[id];

  if (!current) {
    return state;
  }

  const zIndex = state.maxZIndex + 1;

  return {
    maxZIndex: zIndex,
    activeWindowId: id,
    windows: {
      ...state.windows,
      [id]: {
        ...current,
        ...patch,
        isMinimized: false,
        zIndex,
      },
    },
  };
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: createRegistry(),
  maxZIndex: DESKTOP_APPS.length,
  activeWindowId: null,

  openWindow: (id) => {
    const current = get().windows[id];

    if (!current) {
      return;
    }

    if (current.isOpen) {
      if (current.isMinimized) {
        set((state) => bringToFront(state, id, {}));
        return;
      }

      get().focusWindow(id);
      return;
    }

    if (isCompactViewport()) {
      const bounds = maximizedBounds();

      set((state) =>
        bringToFront(state, id, {
          isOpen: true,
          isMaximized: true,
          position: bounds.position,
          size: bounds.size,
          restorePosition: current.position,
          restoreSize: current.size,
        }),
      );
      return;
    }

    const fitted = fitWindow(current.position, current.size);

    set((state) =>
      bringToFront(state, id, {
        isOpen: true,
        isMaximized: false,
        position: fitted.position,
        size: fitted.size,
        restorePosition: null,
        restoreSize: null,
      }),
    );
  },

  closeWindow: (id) => {
    set((state) => {
      const current = state.windows[id];

      if (!current) {
        return state;
      }

      const windows: Record<string, OSWindow> = {
        ...state.windows,
        [id]: {
          ...current,
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          position: current.restorePosition ?? current.position,
          size: current.restoreSize ?? current.size,
          restorePosition: null,
          restoreSize: null,
        },
      };

      return {
        windows,
        activeWindowId:
          state.activeWindowId === id
            ? nextActiveId(windows, id)
            : state.activeWindowId,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const current = state.windows[id];

      if (!current?.isOpen || current.isMinimized) {
        return state;
      }

      const windows: Record<string, OSWindow> = {
        ...state.windows,
        [id]: { ...current, isMinimized: true },
      };

      return {
        windows,
        activeWindowId:
          state.activeWindowId === id
            ? nextActiveId(windows, id)
            : state.activeWindowId,
      };
    });
  },

  toggleMaximize: (id) => {
    const current = get().windows[id];

    if (!current?.isOpen) {
      return;
    }

    if (current.isMaximized && current.restorePosition && current.restoreSize) {
      const restored = fitWindow(current.restorePosition, current.restoreSize);

      set((state) =>
        bringToFront(state, id, {
          isMaximized: false,
          position: restored.position,
          size: restored.size,
          restorePosition: null,
          restoreSize: null,
        }),
      );
      return;
    }

    const bounds = maximizedBounds();

    set((state) =>
      bringToFront(state, id, {
        isMaximized: true,
        restorePosition: current.isMaximized
          ? current.restorePosition
          : current.position,
        restoreSize: current.isMaximized ? current.restoreSize : current.size,
        position: bounds.position,
        size: bounds.size,
      }),
    );
  },

  focusWindow: (id) => {
    const current = get().windows[id];

    if (!current?.isOpen) {
      return;
    }

    set((state) => bringToFront(state, id, {}));
  },

  updatePosition: (id, x, y) => {
    set((state) => {
      const current = state.windows[id];

      if (!current?.isOpen || current.isMaximized) {
        return state;
      }

      const position = clampPosition(x, y, current.size);

      if (
        position.x === current.position.x &&
        position.y === current.position.y
      ) {
        return state;
      }

      return {
        windows: {
          ...state.windows,
          [id]: { ...current, position },
        },
      };
    });
  },

  syncMaximizedToViewport: () => {
    const bounds = maximizedBounds();

    set((state) => {
      let changed = false;
      const windows = { ...state.windows };

      for (const item of Object.values(state.windows)) {
        if (!item.isMaximized) {
          continue;
        }

        if (
          item.position.x === bounds.position.x &&
          item.position.y === bounds.position.y &&
          item.size.width === bounds.size.width &&
          item.size.height === bounds.size.height
        ) {
          continue;
        }

        changed = true;
        windows[item.id] = {
          ...item,
          position: bounds.position,
          size: bounds.size,
        };
      }

      return changed ? { windows } : state;
    });
  },

  minimizeAllWindows: () => {
    set((state) => {
      let changed = false;
      const windows = { ...state.windows };

      for (const item of Object.values(state.windows)) {
        if (!item.isOpen || item.isMinimized) {
          continue;
        }

        changed = true;
        windows[item.id] = { ...item, isMinimized: true };
      }

      if (!changed) {
        return state;
      }

      return {
        windows,
        activeWindowId: null,
      };
    });
  },
}));
