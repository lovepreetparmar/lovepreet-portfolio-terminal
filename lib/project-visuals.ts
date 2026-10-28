import type { ProjectRecord } from "@/lib/portfolio";

export type ProjectVisualId =
  | "lp-os"
  | "todo"
  | "weather"
  | "portfolio-site"
  | "typescript"
  | "engineering"
  | "default";

export function resolveProjectVisual(project: ProjectRecord): ProjectVisualId {
  const title = project.title.toLowerCase();

  if (title.includes("lp os")) {
    return "lp-os";
  }

  if (title === "todoapp") {
    return "todo";
  }

  if (title === "weatherapp") {
    return "weather";
  }

  if (title.includes("github.io")) {
    return "portfolio-site";
  }

  if (
    project.category === "TypeScript" ||
    project.technologies.some((tech) => tech.toLowerCase() === "typescript")
  ) {
    return "typescript";
  }

  if (project.category.toLowerCase().includes("client")) {
    return "engineering";
  }

  return "default";
}
