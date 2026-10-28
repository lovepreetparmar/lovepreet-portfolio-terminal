import { DESKTOP_APPS } from "@/lib/apps";
import type { AppIconName } from "@/types/os";

export type PaletteActionType = "open-app";

export interface PaletteItem {
  id: string;
  label: string;
  description: string;
  keywords: string[];
  icon: AppIconName;
  action: { type: PaletteActionType; appId: string };
}

export const PALETTE_ITEMS: PaletteItem[] = DESKTOP_APPS.map((app) => ({
  id: `open-${app.id}`,
  label: app.title,
  description: `Open ${app.title}`,
  keywords: [app.id, app.title.toLowerCase()],
  icon: app.icon,
  action: { type: "open-app", appId: app.id },
}));

export function filterPaletteItems(query: string): PaletteItem[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return PALETTE_ITEMS;
  }

  return PALETTE_ITEMS.filter((item) => {
    const haystack = [
      item.label.toLowerCase(),
      item.description.toLowerCase(),
      ...item.keywords,
    ].join(" ");

    return haystack.includes(normalized);
  });
}
