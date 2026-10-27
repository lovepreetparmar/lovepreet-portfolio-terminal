import type { DesktopApp } from "@/types/os";

export const DESKTOP_APPS: DesktopApp[] = [
  {
    id: "about",
    title: "About Me",
    icon: "about",
    componentId: "about",
    defaultPosition: { x: 72, y: 48 },
    defaultSize: { width: 560, height: 420 },
  },
  {
    id: "projects",
    title: "Projects",
    icon: "projects",
    componentId: "projects",
    defaultPosition: { x: 132, y: 84 },
    defaultSize: { width: 680, height: 460 },
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: "terminal",
    componentId: "terminal",
    defaultPosition: { x: 188, y: 120 },
    defaultSize: { width: 640, height: 400 },
  },
  {
    id: "resume",
    title: "Resume",
    icon: "resume",
    componentId: "resume",
    defaultPosition: { x: 248, y: 56 },
    defaultSize: { width: 520, height: 500 },
  },
];

export function getDesktopApp(id: string): DesktopApp | undefined {
  return DESKTOP_APPS.find((app) => app.id === id);
}
