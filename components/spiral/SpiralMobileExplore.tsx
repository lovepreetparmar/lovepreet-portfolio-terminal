"use client";

import { ProjectArt } from "@/components/apps/ProjectArt";
import { filterSpiralNodes, buildSpiralNodes } from "@/lib/spiral-nodes";
import { resolveProjectVisual } from "@/lib/project-visuals";
import { getExplorerProjects } from "@/lib/portfolio";

interface SpiralMobileExploreProps {
  searchQuery: string;
  onSelectProject: (projectId: string) => void;
}

export function SpiralMobileExplore({
  searchQuery,
  onSelectProject,
}: SpiralMobileExploreProps) {
  const nodes = filterSpiralNodes(buildSpiralNodes(), searchQuery);
  const projects = getExplorerProjects();

  return (
    <div className="absolute inset-0 z-[2] overflow-auto bg-[#dcdcde] px-4 pb-32 pt-36">
      <ul className="mx-auto grid max-w-lg gap-3 sm:grid-cols-2">
        {nodes.map((node) => {
          const project = projects.find((entry) => entry.id === node.projectId);
          if (!project) {
            return null;
          }

          return (
            <li key={node.id}>
              <button
                type="button"
                onClick={() => onSelectProject(node.projectId)}
                className="lp-focus-ring w-full overflow-hidden rounded-lg border border-black/10 bg-white text-left shadow-sm"
              >
                <ProjectArt
                  visual={resolveProjectVisual(project)}
                  title={project.title}
                  size="card"
                />
                <div className="px-3 py-2">
                  <p className="truncate text-xs font-medium text-neutral-900">{node.label}</p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
      {nodes.length === 0 ? (
        <p className="text-center text-sm text-neutral-500">No matching work.</p>
      ) : null}
    </div>
  );
}
