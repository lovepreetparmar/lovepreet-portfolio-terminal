import { drawBrandLogo } from "@/lib/brand-logos";
import { drawCraftIcon } from "@/lib/craft-icons";
import type { ProjectVisualId } from "@/lib/project-visuals";

export interface SpiralPalette {
  bg: string;
  ink: string;
  accent: string;
  shape: string;
}

const palettes: Record<ProjectVisualId, SpiralPalette> = {
  "lp-os": { bg: "#1b2433", ink: "#f6f1e8", accent: "#e39a45", shape: "#2c3b55" },
  todo: { bg: "#f4e2cf", ink: "#2b2118", accent: "#c44b32", shape: "#e8c9ae" },
  weather: { bg: "#d5e6f6", ink: "#16324f", accent: "#2f6f9a", shape: "#b9d4ee" },
  "portfolio-site": { bg: "#3d2a22", ink: "#f8efe6", accent: "#e7b07a", shape: "#5a3d30" },
  typescript: { bg: "#1e2a44", ink: "#eef3ff", accent: "#7eb6ff", shape: "#31456e" },
  engineering: { bg: "#ece7df", ink: "#1e1c19", accent: "#8d6b45", shape: "#ddd4c8" },
  default: { bg: "#efe6da", ink: "#241c16", accent: "#c46a3a", shape: "#e4d5c4" },
};

export function paletteFor(visual: ProjectVisualId): SpiralPalette {
  return palettes[visual] ?? palettes.default;
}

export function createSpiralTileCanvas(
  paletteOrVisual: SpiralPalette | ProjectVisualId,
  title: string,
  sublabel: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 800;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return canvas;
  }

  const palette =
    (typeof paletteOrVisual === "string" ? paletteFor(paletteOrVisual) : paletteOrVisual) ??
    palettes.default;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, 640, 800);

  ctx.fillStyle = palette.shape;
  ctx.beginPath();
  ctx.ellipse(520, 120, 220, 180, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(80, 640, 180, 140, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.accent;
  ctx.fillRect(48, 48, 86, 8);

  ctx.fillStyle = palette.ink;
  ctx.font = "600 64px Georgia, 'Times New Roman', serif";
  const lines = wrapTitle(ctx, title, 540);
  lines.slice(0, 3).forEach((line, index) => {
    ctx.fillText(line, 48, 560 + index * 72);
  });

  ctx.globalAlpha = 0.72;
  ctx.font = "500 18px system-ui, sans-serif";
  ctx.fillText(sublabel.toUpperCase(), 48, 740);
  ctx.globalAlpha = 1;

  ctx.strokeStyle = "rgba(255,255,255,0.85)";
  ctx.lineWidth = 18;
  ctx.strokeRect(9, 9, 622, 782);

  return canvas;
}

const PAPER = "#f7f1e8";
const INK = "#2a2118";

const CARD_W = 512;
const CARD_H = 704;

export function createHexFaceCanvas(
  palette: SpiralPalette,
  id: string,
  label: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_W;
  canvas.height = CARD_H;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return canvas;
  }

  const display = cssFontFamily("--font-instrument-serif", "Georgia, serif");
  const cardX = 36;
  const cardY = 24;
  const cardW = 440;
  const cardH = 628;
  const radius = 52;

  ctx.clearRect(0, 0, CARD_W, CARD_H);
  ctx.save();
  ctx.shadowColor = "rgba(48, 36, 24, 0.2)";
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 14;
  ctx.fillStyle = PAPER;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, radius);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = "rgba(58, 46, 34, 0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardX + 1, cardY + 1, cardW - 2, cardH - 2, radius - 1);
  ctx.stroke();

  const logoX = CARD_W / 2;
  const logoY = 268;
  const logoSize = 220;

  if (!drawBrandLogo(ctx, id, logoX, logoY, logoSize)) {
    drawCraftIcon(ctx, id, iconInk(palette), logoX, logoY, 7.6);
  }

  ctx.fillStyle = INK;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const size = label.length > 22 ? 30 : label.length > 16 ? 36 : label.length > 11 ? 42 : 48;
  ctx.font = `500 ${size}px ${display}`;
  const lines = wrapTitle(ctx, label, cardW - 64).slice(0, 2);
  const lineHeight = size + 8;
  const start = 560 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line, logoX, start + index * lineHeight);
  });

  return canvas;
}

function iconInk(palette: SpiralPalette): string {
  const accent = luminance(palette.accent);
  if (accent < 0.72) {
    return palette.accent;
  }

  return luminance(palette.bg) < 0.45 ? palette.bg : INK;
}

function luminance(hex: string): number {
  const value = hex.replace("#", "");
  const channels = [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16) / 255);
  const [r, g, b] = channels.map((channel) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function cssFontFamily(variable: string, fallback: string): string {
  const family = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return family ? `${family}, ${fallback}` : fallback;
}

function wrapTitle(ctx: CanvasRenderingContext2D, title: string, maxWidth: number): string[] {
  const words = title.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [title];
}
