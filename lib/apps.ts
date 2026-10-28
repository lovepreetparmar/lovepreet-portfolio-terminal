import type { DesktopApp } from "@/types/os";

export const DESKTOP_APPS: DesktopApp[] = [
  {
    id: "about",
    title: "About Me",
    icon: "about",
    componentId: "about",
    defaultPosition: { x: 300, y: 56 },
    defaultSize: { width: 560, height: 520 },
  },
  {
    id: "projects",
    title: "Projects",
    icon: "projects",
    componentId: "projects",
    defaultPosition: { x: 320, y: 48 },
    defaultSize: { width: 920, height: 640 },
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: "terminal",
    componentId: "terminal",
    defaultPosition: { x: 340, y: 72 },
    defaultSize: { width: 640, height: 400 },
  },
  {
    id: "resume",
    title: "Resume",
    icon: "resume",
    componentId: "resume",
    defaultPosition: { x: 360, y: 64 },
    defaultSize: { width: 560, height: 580 },
  },
];

export function getDesktopApp(id: string): DesktopApp | undefined {
  return DESKTOP_APPS.find((app) => app.id === id);
}
