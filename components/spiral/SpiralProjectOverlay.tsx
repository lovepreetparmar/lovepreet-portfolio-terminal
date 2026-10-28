"use client";

import { ProjectArt } from "@/components/apps/ProjectArt";
import { SpiralOverlayShell } from "@/components/spiral/SpiralOverlayShell";
import { getExplorerProjects } from "@/lib/portfolio";
import { resolveProjectVisual } from "@/lib/project-visuals";

interface SpiralProjectOverlayProps {
  projectId: string;
  onClose: () => void;
}

export function SpiralProjectOverlay({ projectId, onClose }: SpiralProjectOverlayProps) {
  const project = getExplorerProjects().find((entry) => entry.id === projectId);

  if (!project) {
    return (
      <SpiralOverlayShell title="Project" onClose={onClose}>
        <p className="p-8 text-sm text-neutral-600">Project not found.</p>
      </SpiralOverlayShell>
    );
  }

  const visual = resolveProjectVisual(project);

  return (
    <SpiralOverlayShell title={project.title} onClose={onClose}>
      <article className="mx-auto max-w-3xl pb-16">
        <ProjectArt visual={visual} title={project.title} size="hero" className="rounded-none" />
        <div className="space-y-6 px-6 py-8 sm:px-10">
          <header>
            <p className="text-[10px] tracking-[0.4em] text-neutral-500 uppercase">
              {project.category} · Illustrative preview
            </p>
            <h2 className="lp-editorial-display mt-3 text-3xl text-neutral-900 sm:text-4xl">
              {project.title}
            </h2>
          </header>
          {project.description ? (
            <p className="max-w-prose text-sm leading-7 text-neutral-700">
              {project.description}
            </p>
          ) : null}
          {project.technologies.length > 0 ? (
            <p className="text-[10px] tracking-wide text-neutral-500 uppercase">
              {project.technologies.join(" · ")}
            </p>
          ) : null}
          {project.href ? (
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[11px] tracking-[0.2em] text-neutral-700 uppercase underline-offset-4 hover:underline"
            >
              Repository ↗
            </a>
          ) : null}
        </div>
      </article>
    </SpiralOverlayShell>
  );
}
