import { getExplorerProjects } from "@/lib/portfolio";
import { resolveProjectVisual, type ProjectVisualId } from "@/lib/project-visuals";

export interface SpiralNodeData {
  id: string;
  projectId: string;
  label: string;
  sublabel: string;
  searchText: string;
  visual: ProjectVisualId;
  tone: string;
  accent: string;
}

export function buildSpiralNodes(): SpiralNodeData[] {
  return getExplorerProjects().map((project) => {
    const visual = resolveProjectVisual(project);

    return {
      id: project.id,
      projectId: project.id,
      label: project.title,
      sublabel: project.category,
      searchText: [
        project.title,
        project.description,
        project.category,
        ...project.technologies,
      ]
        .join(" ")
        .toLowerCase(),
      visual,
      tone: visualTone(visual),
      accent: visualAccent(visual),
    };
  });
}

function visualTone(visual: ProjectVisualId): string {
  switch (visual) {
    case "lp-os":
      return "#dfe4f0";
    case "todo":
      return "#f2ebe4";
    case "weather":
      return "#dce8f4";
    case "portfolio-site":
      return "#efe4d8";
    case "typescript":
      return "#d8e0f0";
    case "engineering":
      return "#e6e6e6";
    default:
      return "#ececef";
  }
}

function visualAccent(visual: ProjectVisualId): string {
  switch (visual) {
    case "lp-os":
      return "#4a5568";
    case "typescript":
      return "#3178c6";
    default:
      return "#8a8a96";
  }
}

export function filterSpiralNodes(
  nodes: SpiralNodeData[],
  query: string,
): SpiralNodeData[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return nodes;
  }

  return nodes.filter((node) => node.searchText.includes(normalized));
}
