import { HOME_PATH, readNode } from "@/lib/vfs";

export interface ContactLink {
  label: string;
  value: string;
  href: string | null;
}

export interface ExperienceEntry {
  role: string;
  organization: string;
  start: string;
  end: string | null;
  focus?: string;
  location?: string;
}

export interface EducationEntry {
  institution: string;
  credential: string;
  years: string;
}

export interface ExperienceDocument {
  name: string;
  location: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
}

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  href: string | null;
}

export interface AboutProfile {
  name: string;
  headline: string;
  location: string;
  paragraphs: string[];
  interestsLine: string | null;
}

function readText(path: string): string | null {
  const node = readNode(path);

  if (!node || node.type !== "file") {
    return null;
  }

  return node.content;
}

export function getAboutProfile(): AboutProfile | null {
  const raw = readText(`${HOME_PATH}/about.txt`);

  if (!raw) {
    return null;
  }

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const name = lines[0] ?? "Lovepreet Parmar";
  const headline = lines[1] ?? "Software engineer";
  const location = lines[2] ?? "";

  const bodyStart = 3;
  const bodyLines = lines.slice(bodyStart);
  const interestsIndex = bodyLines.findIndex((line) =>
    line.toLowerCase().startsWith("interests include"),
  );

  const paragraphs =
    interestsIndex >= 0 ? bodyLines.slice(0, interestsIndex) : bodyLines;
  const interestsLine =
    interestsIndex >= 0 ? (bodyLines[interestsIndex] ?? null) : null;

  return {
    name,
    headline,
    location,
    paragraphs,
    interestsLine,
  };
}

export function getContactLinks(): ContactLink[] {
  const raw = readText(`${HOME_PATH}/contact.txt`);

  if (!raw) {
    return [];
  }

  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(\S+)\s+(.+)$/);

      if (!match) {
        return { label: line, value: line, href: null };
      }

      const [, label, value] = match;
      const normalized = value.trim();
      const lower = normalized.toLowerCase();

      if (lower === "not published") {
        return { label, value: normalized, href: null };
      }

      if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
        return { label, value: normalized, href: normalized };
      }

      if (label.toLowerCase() === "email") {
        return { label, value: normalized, href: `mailto:${normalized}` };
      }

      return { label, value: normalized, href: null };
    });
}

export function getExperienceDocument(): ExperienceDocument | null {
  const raw = readText(`${HOME_PATH}/experience.json`);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ExperienceDocument;
  } catch {
    return null;
  }
}

export function formatExperienceRange(start: string, end: string | null): string {
  const startLabel = formatYearMonth(start);
  const endLabel = end ? formatYearMonth(end) : "Present";
  return `${startLabel} – ${endLabel}`;
}

function formatYearMonth(value: string): string {
  const [year, month] = value.split("-");

  if (!year) {
    return value;
  }

  if (!month) {
    return year;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const index = Number(month) - 1;

  if (index >= 0 && index < 12) {
    return `${monthNames[index]} ${year}`;
  }

  return value;
}

export function getSkillGroups(): { id: string; title: string; items: string[] }[] {
  const groups = [
    { id: "frontend", title: "Frontend", path: "frontend.txt" },
    { id: "backend", title: "Backend", path: "backend.txt" },
    { id: "tools", title: "Tools", path: "tools.txt" },
  ] as const;

  return groups
    .map((group) => {
      const raw = readText(`${HOME_PATH}/skills/${group.path}`);

      if (!raw) {
        return null;
      }

      const items = raw
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      return { id: group.id, title: group.title, items };
    })
    .filter((group): group is NonNullable<typeof group> => group !== null);
}

const GITHUB_USER = "lovepreetparmar";

function githubRepoUrl(name: string): string | null {
  const slug = name.trim();

  if (!slug || slug.includes(" ")) {
    return null;
  }

  return `https://github.com/${GITHUB_USER}/${slug}`;
}

export function getProjects(): ProjectRecord[] {
  const featured = parsePortfolioMarkdown(readText(`${HOME_PATH}/projects/portfolio.md`));
  const recent = parseRecentWork(readText(`${HOME_PATH}/projects/recent-work.txt`));

  const byId = new Map<string, ProjectRecord>();

  for (const project of [...featured, ...recent]) {
    const existing = byId.get(project.id);

    if (!existing) {
      byId.set(project.id, project);
      continue;
    }

    byId.set(project.id, {
      ...existing,
      description: existing.description || project.description,
      technologies: [
        ...new Set([...existing.technologies, ...project.technologies]),
      ],
      href: existing.href ?? project.href,
    });
  }

  const merged = [...byId.values()];
  const byTitle = new Map<string, ProjectRecord>();

  for (const project of merged) {
    const key = project.title.toLowerCase().trim();
    const existing = byTitle.get(key);

    if (!existing) {
      byTitle.set(key, project);
      continue;
    }

    byTitle.set(key, {
      ...existing,
      description:
        existing.description.length >= project.description.length
          ? existing.description
          : project.description,
      technologies: [...new Set([...existing.technologies, ...project.technologies])],
      href: existing.href ?? project.href,
      category: existing.category === "Featured" ? existing.category : project.category,
    });
  }

  return [...byTitle.values()];
}

/** Projects suitable for the creative portfolio explorer (excludes employment lines from recent-work). */
export function getExplorerProjects(): ProjectRecord[] {
  return getProjects().filter(
    (project) => project.category !== "Client and product engineering",
  );
}

function parsePortfolioMarkdown(raw: string | null): ProjectRecord[] {
  if (!raw) {
    return [];
  }

  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? "LP OS";

  const intro = raw
    .replace(/^#\s+.+\n?/m, "")
    .split(/^##\s+/m)[0]
    ?.trim()
    .replace(/`/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");

  return [
    {
      id: slugify(title),
      title,
      description: intro,
      category: "Featured",
      technologies: extractTechnologies(raw.replace(/`/g, "")),
      href: null,
    },
  ];
}

function parseRecentWork(raw: string | null): ProjectRecord[] {
  if (!raw) {
    return [];
  }

  const projects: ProjectRecord[] = [];
  let category = "Work";
  let current: { title: string; lines: string[] } | null = null;

  const flush = () => {
    if (!current) {
      return;
    }

    const description = current.lines.join(" ").trim();
    const technologies = extractTechnologies(description);
    const href = githubRepoUrl(current.title);

    projects.push({
      id: slugify(`${category}-${current.title}`),
      title: current.title,
      description,
      category,
      technologies,
      href,
    });

    current = null;
  };

  for (const line of raw.split("\n")) {
    if (!line.trim()) {
      continue;
    }

    const indent = line.match(/^(\s*)/)?.[1]?.length ?? 0;
    const text = line.trim();

    if (indent === 0) {
      flush();
      category = text;
      continue;
    }

    if (indent <= 2) {
      flush();
      current = { title: text, lines: [] };
      continue;
    }

    if (current) {
      current.lines.push(text);
    }
  }

  flush();

  const typescriptBundle = projects.find((p) => p.title === "TypeScript projects");

  if (typescriptBundle) {
    const names = typescriptBundle.description
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    for (const name of names) {
      projects.push({
        id: slugify(`typescript-${name}`),
        title: name,
        description: "TypeScript project listed in recent work.",
        category: "TypeScript",
        technologies: ["TypeScript"],
        href: githubRepoUrl(name),
      });
    }
  }

  return projects.filter((project) => project.title !== "TypeScript projects");
}

function extractTechnologies(description: string): string[] {
  const known = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Zustand",
    "Firebase",
    "Express",
    "Material UI",
    "PHP",
    "MySQL",
    "JavaScript",
  ];

  return known.filter((tech) =>
    description.toLowerCase().includes(tech.toLowerCase()),
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getProfessionalTitle(): string {
  const experience = getExperienceDocument();
  const current = experience?.experience.find((entry) => entry.end === null);

  return current?.role ?? "Software Engineer";
}
