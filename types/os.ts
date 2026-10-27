export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export type AppIconName = "about" | "projects" | "terminal" | "resume";

export interface OSWindow {
  id: string;
  title: string;
  icon: AppIconName;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  componentId: string;
  /** Bounds captured just before maximize, used to restore the floating frame. */
  restorePosition: WindowPosition | null;
  restoreSize: WindowSize | null;
}

export interface DesktopApp {
  id: string;
  title: string;
  icon: AppIconName;
  componentId: string;
  defaultPosition: WindowPosition;
  defaultSize: WindowSize;
}
