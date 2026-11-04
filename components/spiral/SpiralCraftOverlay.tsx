"use client";

import { getCraft, projectsForCraft, toolsForCraft } from "@/lib/spiral-nodes";

interface SpiralCraftOverlayProps {
  craftId: string;
  onClose: () => void;
  onOpenProject: (projectId: string) => void;
}

export function SpiralCraftOverlay({
  craftId,
  onClose,
  onOpenProject,
}: SpiralCraftOverlayProps) {
  const craft = getCraft(craftId);
  const projects = projectsForCraft(craftId);
  const tools = toolsForCraft(craftId);

  if (!craft) {
    return null;
  }

  return (
    <div
      className="lp-spiral-overlay lp-spiral-overlay-in fixed inset-0 z-50 grid bg-[#efe6da] text-[#241c16] lg:grid-cols-[0.9fr_1.1fr]"
      role="dialog"
      aria-modal="true"
      aria-label={craft.label}
    >
      <section
        className="relative flex min-h-[36vh] flex-col justify-end px-8 py-10 sm:px-12 lg:min-h-full"
        style={{ background: craft.palette.bg, color: craft.palette.ink }}
      >
        <span
          className="absolute top-10 left-8 h-2 w-16 sm:left-12"
          style={{ background: craft.palette.accent }}
        />
        <p className="text-[11px] tracking-[0.38em] uppercase opacity-70">
          {craft.kind === "tools" ? "Bench" : craft.kind === "skill" ? "Skill" : "Language"}
        </p>
        <h2 className="lp-editorial-display mt-4 text-5xl leading-none sm:text-7xl">{craft.label}</h2>
        <p className="mt-6 max-w-md text-base leading-7 opacity-80">{craft.blurb}</p>
      </section>

      <section className="flex min-h-0 flex-col px-8 py-8 sm:px-12">
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="lp-spiral-pill lp-focus-ring">
            Close
          </button>
        </div>

        <div className="mt-6 min-h-0 flex-1 overflow-auto pb-10">
          {tools.length > 0 ? (
            <ul className="space-y-4">
              {tools.map((tool) => (
                <li key={tool} className="border-b border-black/10 pb-4">
                  <p className="lp-editorial-display text-3xl">{tool}</p>
                </li>
              ))}
            </ul>
          ) : null}

          {projects.length > 0 ? (
            <ul className="space-y-3">
              {projects.map((project) => (
                <li key={project.id}>
                  <button
                    type="button"
                    onClick={() => onOpenProject(project.id)}
                    className="lp-focus-ring w-full rounded-2xl border border-black/10 bg-white/70 px-5 py-4 text-left hover:bg-white"
                  >
                    <p className="text-[10px] tracking-[0.28em] text-[#8a5a32] uppercase">
                      {project.category}
                    </p>
                    <p className="lp-editorial-display mt-1 text-2xl">{project.title}</p>
                    {project.description ? (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#5c5148]">
                        {project.description}
                      </p>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {projects.length === 0 && tools.length === 0 ? (
            <p className="text-sm leading-7 text-[#5c5148]">
              Listed in the toolkit. The project write-ups do not name it on its own yet.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
