import type { ProjectVisualId } from "@/lib/project-visuals";

interface ProjectArtProps {
  visual: ProjectVisualId;
  title: string;
  className?: string;
  size?: "card" | "hero" | "thumb";
}

export function ProjectArt({
  visual,
  title,
  className = "",
  size = "card",
}: ProjectArtProps) {
  const height =
    size === "hero" ? "min-h-[220px] sm:min-h-[280px]" : size === "thumb" ? "min-h-[100px]" : "min-h-[140px]";

  return (
    <div
      className={`lp-project-art lp-project-art--${visual} relative overflow-hidden ${height} ${className}`}
      aria-hidden="true"
    >
      <div className="lp-project-art__noise" />
      <div className="relative h-full p-5 sm:p-6">{renderMotif(visual, title, size)}</div>
      <span className="sr-only">Illustrative artwork for {title}, not a product screenshot.</span>
    </div>
  );
}

function renderMotif(visual: ProjectVisualId, title: string, size: "card" | "hero" | "thumb") {
  switch (visual) {
    case "lp-os":
      return (
        <div className="flex h-full flex-col justify-between">
          <p className="text-[10px] tracking-[0.35em] text-white/35 uppercase">System</p>
          <p className="lp-editorial-display text-3xl text-white/90 sm:text-4xl">LP OS</p>
          <p className="max-w-xs text-xs leading-relaxed text-white/45">
            Desktop portfolio as an operating environment.
          </p>
        </div>
      );
    case "todo":
      return (
        <ul className="space-y-2 text-xs text-white/55">
          <li className="border-l border-[var(--lp-accent)] pl-3">Ship features</li>
          <li className="border-l border-white/15 pl-3 opacity-70">Review tasks</li>
          <li className="border-l border-white/15 pl-3 opacity-50">TodoApp</li>
        </ul>
      );
    case "weather":
      return (
        <div>
          <p className="lp-editorial-display text-5xl text-white/85">24°</p>
          <p className="mt-2 text-[10px] tracking-[0.3em] text-white/40 uppercase">Weather study</p>
        </div>
      );
    case "portfolio-site":
      return (
        <div className="flex h-full flex-col justify-end">
          <p className="text-[10px] tracking-[0.4em] text-[var(--lp-accent)] uppercase">Site</p>
          <p className="lp-editorial-display mt-2 text-2xl leading-tight text-white/90">
            {title.split(".")[0]}
          </p>
        </div>
      );
    case "typescript":
      return (
        <pre className="font-mono text-[10px] leading-relaxed text-white/50">
          <code>{`export function ${sanitizeFn(title)}() {\n  return craft();\n}`}</code>
        </pre>
      );
    case "engineering":
      return (
        <div className="grid grid-cols-4 gap-1 opacity-40">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-6 border border-white/10 bg-white/[0.03]" />
          ))}
        </div>
      );
    default:
      return (
        <p
          className={`lp-editorial-display text-white/85 ${size === "hero" ? "text-3xl" : "text-xl"}`}
        >
          {title}
        </p>
      );
  }
}

function sanitizeFn(title: string): string {
  const slug = title.replace(/[^a-zA-Z0-9]/g, "");

  return slug || "project";
}
