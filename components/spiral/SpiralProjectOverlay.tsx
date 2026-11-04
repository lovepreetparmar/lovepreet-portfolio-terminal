"use client";

import { getExplorerProjects } from "@/lib/portfolio";
import { resolveProjectVisual } from "@/lib/project-visuals";
import { paletteFor } from "@/lib/spiral-texture";

interface SpiralProjectOverlayProps {
  projectId: string;
  onClose: () => void;
}

export function SpiralProjectOverlay({ projectId, onClose }: SpiralProjectOverlayProps) {
  const project = getExplorerProjects().find((entry) => entry.id === projectId);

  if (!project) {
    return (
      <div className="lp-spiral-overlay fixed inset-0 z-50 grid place-items-center bg-[#efe6da]">
        <button type="button" onClick={onClose} className="lp-spiral-pill">
          Close
        </button>
      </div>
    );
  }

  const palette = paletteFor(resolveProjectVisual(project));

  return (
    <div
      className="lp-spiral-overlay lp-spiral-overlay-in fixed inset-0 z-50 grid bg-[#efe6da] text-[#241c16] lg:grid-cols-[1.05fr_0.95fr]"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <section
        className="relative flex min-h-[42vh] flex-col justify-end overflow-hidden px-8 py-10 sm:px-12 lg:min-h-full"
        style={{ background: palette.bg, color: palette.ink }}
      >
        <span
          className="absolute top-10 left-8 h-2 w-16 sm:left-12"
          style={{ background: palette.accent }}
        />
        <p className="text-[11px] tracking-[0.38em] uppercase opacity-70">{project.category}</p>
        <h2 className="lp-editorial-display mt-4 max-w-xl text-5xl leading-[0.95] sm:text-7xl">
          {project.title}
        </h2>
      </section>

      <section className="relative flex flex-col justify-between px-8 py-8 sm:px-12 sm:py-12">
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="lp-spiral-pill lp-focus-ring">
            Back
          </button>
        </div>
        <div className="max-w-md space-y-6 py-10">
          {project.description ? (
            <p className="text-lg leading-8 text-[#3d342c]">{project.description}</p>
          ) : (
            <p className="text-lg leading-8 text-[#3d342c]">
              A piece of work from the spiral.
            </p>
          )}
          {project.technologies.length > 0 ? (
            <p className="text-[12px] tracking-[0.18em] text-[#8a5a32] uppercase">
              {project.technologies.join("  ·  ")}
            </p>
          ) : null}
        </div>
        <div>
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="lp-editorial-display text-3xl text-[#241c16] underline-offset-8 hover:underline"
            >
              Open repository
            </a>
          ) : (
            <p className="text-sm text-[#6d6258]">Illustrative preview</p>
          )}
        </div>
      </section>
    </div>
  );
}
