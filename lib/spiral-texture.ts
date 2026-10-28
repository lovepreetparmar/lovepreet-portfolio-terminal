import type { ProjectVisualId } from "@/lib/project-visuals";

const visualBackground: Record<ProjectVisualId, [string, string]> = {
  "lp-os": ["#2a3344", "#dfe4f0"],
  todo: ["#3d3428", "#f2ebe4"],
  weather: ["#1e3348", "#dce8f4"],
  "portfolio-site": ["#4a3528", "#efe4d8"],
  typescript: ["#243048", "#d8e0f0"],
  engineering: ["#2a2a2a", "#e6e6e6"],
  default: ["#333338", "#ececef"],
};

export function createSpiralTileCanvas(
  visual: ProjectVisualId,
  title: string,
  sublabel: string,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 600;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return canvas;
  }

  const [top, bottom] = visualBackground[visual] ?? visualBackground.default;
  const gradient = ctx.createLinearGradient(0, 0, 480, 600);
  gradient.addColorStop(0, top);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 480, 600);

  ctx.fillStyle = "rgba(255,255,255,0.07)";
  for (let index = 0; index < 14; index += 1) {
    const size = 18 + (index % 4) * 6;
    ctx.fillRect(24 + (index % 5) * 82, 60 + Math.floor(index / 5) * 90, size, size);
  }

  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "600 30px system-ui, -apple-system, sans-serif";
  const displayTitle = title.length > 20 ? `${title.slice(0, 19)}…` : title;
  ctx.fillText(displayTitle, 28, 518);

  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "500 13px system-ui, -apple-system, sans-serif";
  ctx.fillText(sublabel.toUpperCase(), 28, 552);

  return canvas;
}
