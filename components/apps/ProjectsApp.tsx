"use client";

import { useMemo, useState } from "react";
import { ProjectArt } from "@/components/apps/ProjectArt";
import { AppScroll } from "@/components/ui/AppSurface";
import { getExplorerProjects, type ProjectRecord } from "@/lib/portfolio";
import { resolveProjectVisual } from "@/lib/project-visuals";

export function ProjectsApp() {
  const projects = useMemo(() => getExplorerProjects(), []);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return projects;
    }

    return projects.filter((project) => {
      const haystack = [
        project.title,
        project.description,
        project.category,
        ...project.technologies,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [projects, query]);

  const featured =
    filtered.find((project) => project.category === "Featured") ?? filtered[0] ?? null;
  const rest = filtered.filter((project) => project.id !== featured?.id);
  const detail = detailId
    ? filtered.find((project) => project.id === detailId) ?? null
    : null;

  if (detail) {
    return (
      <AppScroll>
        <ProjectDetailView project={detail} onBack={() => setDetailId(null)} />
      </AppScroll>
    );
  }

  return (
    <AppScroll>
      <div className="lp-projects-editorial pb-12">
        <header className="flex items-start justify-between gap-6 px-5 pt-5 sm:px-8 sm:pt-7">
          <div>
            <p className="text-[10px] tracking-[0.45em] text-white/40 uppercase">Selected work</p>
            <h2 className="lp-editorial-display mt-3 max-w-md text-[1.75rem] leading-[1.1] text-white sm:text-[2.25rem]">
              Interfaces, tools, and shipped software.
            </h2>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2 pt-1">
            <span className="text-[11px] tabular-nums text-white/35">
              {filtered.length} projects
            </span>
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Search projects"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
              className="lp-focus-ring text-[10px] tracking-[0.2em] text-white/45 uppercase hover:text-white/70"
            >
              {searchOpen ? "Close" : "Search"}
            </button>
          </div>
        </header>

        {searchOpen ? (
          <label className="mx-5 mt-4 block max-w-sm sm:mx-8">
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by name or stack"
              autoFocus
              className="lp-input-underline lp-focus-ring"
            />
          </label>
        ) : null}

        {filtered.length === 0 ? (
          <p className="px-8 py-20 text-sm text-white/45">No matches.</p>
        ) : (
          <>
            {featured ? (
              <button
                type="button"
                onClick={() => setDetailId(featured.id)}
                className="lp-mag-feature lp-focus-ring group mx-0 mt-8 block w-full text-left"
              >
                <ProjectArt
                  visual={resolveProjectVisual(featured)}
                  title={featured.title}
                  size="hero"
                />
                <div className="space-y-4 px-5 py-6 sm:px-8 sm:py-8">
                  <div>
                    <p className="text-[10px] tracking-[0.35em] text-[var(--lp-accent)] uppercase">
                      Featured
                    </p>
                    <h3 className="lp-editorial-display mt-2 text-2xl text-white sm:text-3xl">
                      {featured.title}
                    </h3>
                  </div>
                  {featured.description ? (
                    <p className="max-w-2xl text-sm leading-7 text-white/58">
                      {featured.description}
                    </p>
                  ) : null}
                  <TechList items={featured.technologies} />
                </div>
              </button>
            ) : null}

            {rest.length > 0 ? (
              <ul className="lp-mag-grid mx-5 mt-8 sm:mx-8">
                {rest.map((project, index) => (
                  <li
                    key={project.id}
                    className={index % 5 === 0 ? "lp-mag-grid-span" : undefined}
                  >
                    <button
                      type="button"
                      onClick={() => setDetailId(project.id)}
                      className="lp-mag-tile lp-focus-ring group w-full"
                    >
                      <ProjectArt
                        visual={resolveProjectVisual(project)}
                        title={project.title}
                        size={index % 5 === 0 ? "hero" : "card"}
                        className={index % 5 === 0 ? "min-h-[180px]" : undefined}
                      />
                      <div className="space-y-2 p-4 sm:p-5">
                        <p className="text-[9px] tracking-[0.32em] text-white/32 uppercase">
                          {project.category}
                        </p>
                        <h3 className="text-base font-medium text-white/90 group-hover:text-white">
                          {project.title}
                        </h3>
                        {project.description ? (
                          <p className="line-clamp-2 text-xs leading-5 text-white/45">
                            {project.description}
                          </p>
                        ) : null}
                        <TechList items={project.technologies} compact />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        )}
      </div>
    </AppScroll>
  );
}

function TechList({ items, compact = false }: { items: string[]; compact?: boolean }) {
  if (items.length === 0) {
    return null;
  }

  const slice = compact ? items.slice(0, 4) : items;

  return (
    <p className="text-[10px] tracking-wide text-white/42 uppercase">
      {slice.join(" · ")}
    </p>
  );
}

function ProjectDetailView({
  project,
  onBack,
}: {
  project: ProjectRecord;
  onBack: () => void;
}) {
  const visual = resolveProjectVisual(project);

  return (
    <article className="lp-detail-in pb-12">
      <div className="px-5 pt-4 sm:px-8">
        <button type="button" onClick={onBack} className="lp-text-button lp-focus-ring">
          ← Index
        </button>
      </div>
      <ProjectArt visual={visual} title={project.title} size="hero" />
      <div className="space-y-6 px-5 py-8 sm:px-8">
        <header>
          <p className="text-[10px] tracking-[0.4em] text-white/35 uppercase">
            {project.category} · Illustrative preview
          </p>
          <h3 className="lp-editorial-display mt-3 text-3xl text-white sm:text-4xl">
            {project.title}
          </h3>
        </header>
        {project.description ? (
          <p className="max-w-prose text-sm leading-7 text-white/62">{project.description}</p>
        ) : null}
        <TechList items={project.technologies} />
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="lp-text-button lp-focus-ring inline-block no-underline"
          >
            Repository ↗
          </a>
        ) : null}
      </div>
    </article>
  );
}
