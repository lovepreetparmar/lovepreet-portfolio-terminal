import { TASKBAR_HEIGHT } from "@/lib/constants";
import type { WindowPosition, WindowSize } from "@/types/os";

const EDGE_MARGIN = 8;
const MIN_VISIBLE_WIDTH = 160;

function viewport() {
  if (typeof window === "undefined") {
    return { width: 1280, height: 800 };
  }

  return { width: window.innerWidth, height: window.innerHeight };
}

export function maximizedBounds(): { position: WindowPosition; size: WindowSize } {
  const { width, height } = viewport();

  return {
    position: { x: EDGE_MARGIN, y: EDGE_MARGIN },
    size: {
      width: Math.max(280, width - EDGE_MARGIN * 2),
      height: Math.max(220, height - TASKBAR_HEIGHT - EDGE_MARGIN * 2),
    },
  };
}

export function clampPosition(
  x: number,
  y: number,
  size: WindowSize,
): WindowPosition {
  const { width, height } = viewport();
  const maxX = Math.max(EDGE_MARGIN, width - MIN_VISIBLE_WIDTH);
  const maxY = Math.max(0, height - TASKBAR_HEIGHT - 40);
  const minX = Math.min(EDGE_MARGIN, MIN_VISIBLE_WIDTH - size.width);

  return {
    x: Math.min(Math.max(minX, x), maxX),
    y: Math.min(Math.max(0, y), maxY),
  };
}

export function fitWindow(
  position: WindowPosition,
  size: WindowSize,
): { position: WindowPosition; size: WindowSize } {
  const { width, height } = viewport();
  const nextSize: WindowSize = {
    width: Math.min(size.width, Math.max(280, width - EDGE_MARGIN * 2)),
    height: Math.min(
      size.height,
      Math.max(220, height - TASKBAR_HEIGHT - EDGE_MARGIN * 2),
    ),
  };
  const maxX = Math.max(EDGE_MARGIN, width - nextSize.width - EDGE_MARGIN);
  const maxY = Math.max(
    EDGE_MARGIN,
    height - TASKBAR_HEIGHT - nextSize.height - EDGE_MARGIN,
  );

  return {
    size: nextSize,
    position: {
      x: Math.min(Math.max(EDGE_MARGIN, position.x), maxX),
      y: Math.min(Math.max(EDGE_MARGIN, position.y), maxY),
    },
  };
}
