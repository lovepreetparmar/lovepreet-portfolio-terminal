import { getExplorerProjects, type ProjectRecord } from "@/lib/portfolio";
import type { SpiralPalette } from "@/lib/spiral-texture";

export interface SpiralNodeData {
  id: string;
  label: string;
  sublabel: string;
  searchText: string;
  palette: SpiralPalette;
  blurb: string;
  kind: "language" | "tools" | "skill";
  previewTitle: string;
}

const CRAFTS: Array<{
  id: string;
  label: string;
  kind: "language" | "tools" | "skill";
  match: string[];
  implyFrom?: string[];
  blurb: string;
  palette: SpiralPalette;
  tools?: string[];
}> = [
  {
    id: "react",
    label: "React",
    kind: "language",
    match: ["react"],
    implyFrom: ["next.js"],
    blurb: "Interfaces shipped in React, including Next.js apps that are React underneath.",
    palette: { bg: "#0e1c24", ink: "#e7f8ff", accent: "#61dafb", shape: "#163642" },
  },
  {
    id: "next",
    label: "Next.js",
    kind: "language",
    match: ["next.js", "nextjs"],
    blurb: "App Router work: this portfolio, routing, and the interface around it.",
    palette: { bg: "#161616", ink: "#f5f5f5", accent: "#ffffff", shape: "#2a2a2a" },
  },
  {
    id: "typescript",
    label: "TypeScript",
    kind: "language",
    match: ["typescript"],
    blurb: "Most of the recent product work is typed end to end.",
    palette: { bg: "#1e2a44", ink: "#eef3ff", accent: "#7eb6ff", shape: "#31456e" },
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    kind: "language",
    match: ["tailwind"],
    blurb: "Layout and visual systems styled with Tailwind.",
    palette: { bg: "#0f2430", ink: "#e7fbff", accent: "#38bdf8", shape: "#164055" },
  },
  {
    id: "html",
    label: "HTML",
    kind: "language",
    match: ["html", "html5"],
    implyFrom: ["php"],
    blurb: "The markup under the earlier PHP sites and the interfaces since, including HTML5.",
    palette: { bg: "#3a1c12", ink: "#fff4ee", accent: "#f16529", shape: "#542818" },
  },
  {
    id: "css",
    label: "CSS",
    kind: "language",
    match: ["css", "cascading style sheets"],
    blurb: "Layout and visual styling, including the Tailwind systems. Passed the LinkedIn CSS assessment.",
    palette: { bg: "#10182e", ink: "#eef2ff", accent: "#3b82f6", shape: "#1c2a4d" },
  },
  {
    id: "react-native",
    label: "React Native",
    kind: "language",
    match: ["react native"],
    blurb: "Mobile interfaces in the same React model as the web work.",
    palette: { bg: "#10242a", ink: "#e7fbff", accent: "#5eead4", shape: "#173840" },
  },
  {
    id: "jquery",
    label: "jQuery",
    kind: "language",
    match: ["jquery"],
    blurb: "Earlier front-end work, before the React interfaces.",
    palette: { bg: "#101820", ink: "#e8f4ff", accent: "#0769ad", shape: "#1a3044" },
  },
  {
    id: "javascript",
    label: "JavaScript",
    kind: "language",
    match: ["javascript"],
    implyFrom: ["react", "next.js"],
    blurb: "The language under the React and Next.js interfaces.",
    palette: { bg: "#2a2416", ink: "#fff6dc", accent: "#f7df1e", shape: "#3d3420" },
  },
  {
    id: "node",
    label: "Node.js",
    kind: "language",
    match: ["node.js", "node"],
    implyFrom: ["express"],
    blurb: "Server-side JavaScript, including the Express APIs.",
    palette: { bg: "#14241a", ink: "#e9ffef", accent: "#68d391", shape: "#1d3a28" },
  },
  {
    id: "express",
    label: "Express",
    kind: "language",
    match: ["express"],
    blurb: "HTTP APIs in front of the product data.",
    palette: { bg: "#2a241c", ink: "#f8f1e8", accent: "#e8c9a0", shape: "#3d3428" },
  },
  {
    id: "php",
    label: "PHP",
    kind: "language",
    match: ["php"],
    blurb: "Earlier web work, including an e-commerce site and client projects.",
    palette: { bg: "#2a2030", ink: "#f6eeff", accent: "#c4b5fd", shape: "#3d2e48" },
  },
  {
    id: "mysql",
    label: "MySQL",
    kind: "language",
    match: ["mysql"],
    implyFrom: ["php"],
    blurb: "The database behind the PHP and e-commerce work.",
    palette: { bg: "#0e242c", ink: "#e7f8ff", accent: "#00758f", shape: "#163844" },
  },
  {
    id: "codeigniter",
    label: "CodeIgniter",
    kind: "language",
    match: ["codeigniter"],
    blurb: "PHP applications built on CodeIgniter.",
    palette: { bg: "#2a140e", ink: "#fff4ee", accent: "#ee4323", shape: "#3d2218" },
  },
  {
    id: "wordpress",
    label: "WordPress",
    kind: "language",
    match: ["wordpress"],
    blurb: "Sites built and customized on WordPress.",
    palette: { bg: "#101820", ink: "#eef6fb", accent: "#21759b", shape: "#1a3040" },
  },
  {
    id: "firebase",
    label: "Firebase",
    kind: "language",
    match: ["firebase"],
    blurb: "Auth and data for the todo application.",
    palette: { bg: "#2a2214", ink: "#fff6e8", accent: "#f6a623", shape: "#3d321c" },
  },
  {
    id: "laravel",
    label: "Laravel",
    kind: "language",
    match: ["laravel"],
    blurb: "PHP applications on Laravel across LPSynch and earlier companies.",
    palette: { bg: "#1c1412", ink: "#fff4ee", accent: "#ff2d20", shape: "#3a221c" },
  },
  {
    id: "bootstrap",
    label: "Bootstrap",
    kind: "language",
    match: ["bootstrap"],
    blurb: "Component layout on the earlier PHP, WordPress, and client sites.",
    palette: { bg: "#1a1030", ink: "#f4eeff", accent: "#7952b3", shape: "#2c1c4a" },
  },
  {
    id: "ajax",
    label: "AJAX",
    kind: "language",
    match: ["ajax"],
    blurb: "Async requests in the PHP and JavaScript interfaces.",
    palette: { bg: "#1a2218", ink: "#f3ffef", accent: "#8bc34a", shape: "#2a3824" },
  },
  {
    id: "json",
    label: "JSON",
    kind: "language",
    match: ["json"],
    blurb: "The data shape between the APIs and the interfaces.",
    palette: { bg: "#241c14", ink: "#fff6ea", accent: "#e8a04a", shape: "#3a2c20" },
  },
  {
    id: "sql",
    label: "SQL",
    kind: "language",
    match: ["sql"],
    blurb: "Queries behind the MySQL databases, from Upwork and LPSynch.",
    palette: { bg: "#102028", ink: "#e7f6ff", accent: "#4db6e8", shape: "#1a3440" },
  },
  {
    id: "mysqli",
    label: "MySQLi",
    kind: "language",
    match: ["mysqli"],
    blurb: "PHP database access in the MySQL applications.",
    palette: { bg: "#0e2830", ink: "#e7fbff", accent: "#2aa7c9", shape: "#163c48" },
  },
  {
    id: "docker",
    label: "Docker",
    kind: "skill",
    match: ["docker"],
    blurb: "Containers in the toolchain next to Git.",
    palette: { bg: "#10243a", ink: "#e7f4ff", accent: "#2496ed", shape: "#183454" },
  },
  {
    id: "gcp",
    label: "Google Cloud Platform",
    kind: "skill",
    match: ["google cloud", "gcp"],
    blurb: "Cloud platform work in the delivery toolkit.",
    palette: { bg: "#1a2430", ink: "#eef6ff", accent: "#4285f4", shape: "#243448" },
  },
  {
    id: "github",
    label: "GitHub",
    kind: "skill",
    match: ["github"],
    blurb: "Repositories and review for the LPSynch and public projects.",
    palette: { bg: "#161616", ink: "#f5f5f5", accent: "#f0f0f0", shape: "#2c2c2c" },
  },
  {
    id: "linux",
    label: "Linux",
    kind: "skill",
    match: ["linux"],
    blurb: "Linux machines from the Upwork work and Android ROM testing.",
    palette: { bg: "#1a1408", ink: "#fff6dc", accent: "#f5c518", shape: "#32280e" },
  },
  {
    id: "kali",
    label: "Kali Linux",
    kind: "skill",
    match: ["kali"],
    blurb: "Security tooling on Kali, alongside the ethical hacking practice.",
    palette: { bg: "#141820", ink: "#eef2ff", accent: "#7d8cff", shape: "#222838" },
  },
  {
    id: "photoshop",
    label: "Adobe Photoshop",
    kind: "skill",
    match: ["photoshop"],
    blurb: "Visual production across the LPSynch and client work.",
    palette: { bg: "#0e1c2e", ink: "#e7f2ff", accent: "#31a8ff", shape: "#16304a" },
  },
  {
    id: "inkscape",
    label: "Inkscape",
    kind: "skill",
    match: ["inkscape"],
    blurb: "Vector artwork alongside the graphic design work.",
    palette: { bg: "#102018", ink: "#e9fff4", accent: "#2db87a", shape: "#183428" },
  },
  {
    id: "eclipse",
    label: "Eclipse",
    kind: "skill",
    match: ["eclipse"],
    blurb: "An editor from the earlier coding setup.",
    palette: { bg: "#241418", ink: "#fff0f2", accent: "#e07a8a", shape: "#3a2228" },
  },
  {
    id: "sublime",
    label: "Sublime Text",
    kind: "skill",
    match: ["sublime"],
    blurb: "The editor used on the Upwork projects.",
    palette: { bg: "#2a2214", ink: "#fff6e4", accent: "#f0c14a", shape: "#3e321c" },
  },
  {
    id: "word",
    label: "Microsoft Word",
    kind: "skill",
    match: ["microsoft word"],
    blurb: "Documents from the Upwork software work.",
    palette: { bg: "#102040", ink: "#eef4ff", accent: "#2b579a", shape: "#1a3058" },
  },
  {
    id: "excel",
    label: "Microsoft Excel",
    kind: "skill",
    match: ["excel"],
    blurb: "Spreadsheets from the Upwork software work.",
    palette: { bg: "#102818", ink: "#eefaf2", accent: "#217346", shape: "#1a3c24" },
  },
  {
    id: "powerpoint",
    label: "PowerPoint",
    kind: "skill",
    match: ["powerpoint"],
    blurb: "Decks from the Upwork software work.",
    palette: { bg: "#2a1810", ink: "#fff4ee", accent: "#d24726", shape: "#402418" },
  },
  {
    id: "office",
    label: "Microsoft Office",
    kind: "skill",
    match: ["microsoft office"],
    blurb: "The Office suite around the Upwork delivery work.",
    palette: { bg: "#1a2030", ink: "#eef2ff", accent: "#d83b01", shape: "#2a3448" },
  },
  {
    id: "logo-design",
    label: "Logo Design",
    kind: "skill",
    match: ["logo"],
    blurb: "Identity work from the graphic design role at Socialbangbang.",
    palette: { bg: "#2a1420", ink: "#fff0f6", accent: "#e45b8a", shape: "#402030" },
  },
  {
    id: "poster-design",
    label: "Poster Design",
    kind: "skill",
    match: ["poster"],
    blurb: "Poster work from the graphic design role at Socialbangbang.",
    palette: { bg: "#241820", ink: "#fff2f8", accent: "#c45b8a", shape: "#3a2834" },
  },
  {
    id: "graphic-design",
    label: "Graphic Design",
    kind: "skill",
    match: ["graphic design"],
    blurb: "Design across LPSynch, Socialbangbang, and the client projects.",
    palette: { bg: "#281820", ink: "#fff4f8", accent: "#e07098", shape: "#3c2832" },
  },
  {
    id: "software-design",
    label: "Software Design",
    kind: "skill",
    match: ["software design"],
    blurb: "Shaping the software, alongside the senior engineering at LPSynch.",
    palette: { bg: "#161c28", ink: "#eef3ff", accent: "#8aa4e8", shape: "#242e42" },
  },
  {
    id: "web-development",
    label: "Web Development",
    kind: "skill",
    match: ["web development"],
    blurb: "Sites and apps at LPSynch and the companies before it.",
    palette: { bg: "#142028", ink: "#e8f7ff", accent: "#3db8d8", shape: "#1e3642" },
  },
  {
    id: "web-applications",
    label: "Web Applications",
    kind: "skill",
    match: ["web application"],
    blurb: "Product interfaces shipped at LPSynch and earlier roles.",
    palette: { bg: "#101c24", ink: "#e7f6ff", accent: "#4aa8d8", shape: "#1a3040" },
  },
  {
    id: "web-services",
    label: "Web Services API",
    kind: "skill",
    match: ["web services", "api"],
    blurb: "HTTP APIs in front of the product data at LPSynch.",
    palette: { bg: "#1c1828", ink: "#f3eeff", accent: "#a78bfa", shape: "#2c2640" },
  },
  {
    id: "php-applications",
    label: "PHP Applications",
    kind: "language",
    match: ["php application"],
    implyFrom: ["php"],
    blurb: "PHP products at LPSynch and the companies before it.",
    palette: { bg: "#241c30", ink: "#f6f0ff", accent: "#b79cff", shape: "#382c48" },
  },
  {
    id: "research",
    label: "Research",
    kind: "skill",
    match: ["research"],
    blurb: "Research behind the product and client decisions.",
    palette: { bg: "#201c14", ink: "#fff8ea", accent: "#d4a574", shape: "#342c20" },
  },
  {
    id: "strategic-planning",
    label: "Strategic Planning",
    kind: "skill",
    match: ["strategic planning"],
    blurb: "Planning around the engineering and client projects.",
    palette: { bg: "#1a1c24", ink: "#f2f4ff", accent: "#9aa8d4", shape: "#282c3c" },
  },
  {
    id: "social-media",
    label: "Social Media",
    kind: "skill",
    match: ["social media"],
    blurb: "Social and campaign work from the design roles.",
    palette: { bg: "#24141c", ink: "#fff0f6", accent: "#e06090", shape: "#3a2430" },
  },
  {
    id: "management",
    label: "Management",
    kind: "skill",
    match: ["management"],
    blurb: "Running client work as a software developer on Upwork.",
    palette: { bg: "#1c2018", ink: "#f4fff0", accent: "#8aaa78", shape: "#2c3428" },
  },
  {
    id: "leadership",
    label: "Leadership",
    kind: "skill",
    match: ["leadership"],
    blurb: "Leading engineering work as a senior engineer at LPSynch.",
    palette: { bg: "#241810", ink: "#fff4ec", accent: "#e09058", shape: "#3a281c" },
  },
  {
    id: "ethical-hacking",
    label: "Ethical Hacking",
    kind: "skill",
    match: ["ethical hacking"],
    blurb: "Security practice alongside the Kali Linux work.",
    palette: { bg: "#101810", ink: "#eefae8", accent: "#6db86a", shape: "#1c2c1c" },
  },
  {
    id: "information-technology",
    label: "Information Technology",
    kind: "skill",
    match: ["information technology"],
    blurb: "The broader IT practice around the Upwork software work.",
    palette: { bg: "#141820", ink: "#eef2fa", accent: "#8a9bb8", shape: "#222838" },
  },
  {
    id: "coding-languages",
    label: "Coding Languages",
    kind: "skill",
    match: ["coding language"],
    blurb: "The languages under the web and product work.",
    palette: { bg: "#1a1820", ink: "#f4f0ff", accent: "#b0a0e0", shape: "#2a2838" },
  },
  {
    id: "tools",
    label: "Tools",
    kind: "tools",
    match: [],
    blurb: "The bench around the code: version control and the editor.",
    tools: ["Git", "Cursor"],
    palette: { bg: "#241c16", ink: "#f6f1e8", accent: "#e39a45", shape: "#3a2e24" },
  },
];

export function buildSpiralNodes(): SpiralNodeData[] {
  const projects = getExplorerProjects();

  return CRAFTS.map((craft) => {
    const linked = projectsForCraft(craft.id, projects);
    const countLabel =
      craft.kind === "tools"
        ? "How I work"
        : linked.length === 0
          ? "In the toolkit"
          : linked.length === 1
            ? "1 project"
            : `${linked.length} projects`;

    return {
      id: craft.id,
      label: craft.label,
      sublabel: countLabel,
      searchText: [craft.label, craft.blurb, ...(craft.tools ?? []), ...linked.map((project) => project.title)]
        .join(" ")
        .toLowerCase(),
      palette: craft.palette,
      blurb: craft.blurb,
      kind: craft.kind,
      previewTitle: linked[0]?.title ?? craft.label,
    };
  });
}

export function getCraft(id: string) {
  return CRAFTS.find((craft) => craft.id === id) ?? null;
}

export function projectsForCraft(id: string, projects = getExplorerProjects()): ProjectRecord[] {
  const craft = getCraft(id);

  if (!craft || craft.id === "tools") {
    return [];
  }

  return projects.filter((project) => projectMatchesCraft(project, craft));
}

export function toolsForCraft(id: string): string[] {
  return getCraft(id)?.tools ?? [];
}

function projectMatchesCraft(
  project: ProjectRecord,
  craft: (typeof CRAFTS)[number],
): boolean {
  const haystack = [project.title, project.description, project.category, ...project.technologies]
    .join(" ")
    .toLowerCase();

  const needles = [...craft.match, ...(craft.implyFrom ?? [])];

  return needles.some((needle) => includesTerm(haystack, needle));
}

function includesTerm(haystack: string, needle: string): boolean {
  const escaped = needle.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`).test(haystack);
}

/** Each craft keeps a single thread to the craft it shares the most projects with. */
export function craftBonds(projects = getExplorerProjects()): Array<[string, string]> {
  const crafts = CRAFTS.filter((craft) => craft.id !== "tools");
  const weight = new Map<string, number>();

  const pairKey = (left: string, right: string) => (left < right ? `${left}|${right}` : `${right}|${left}`);

  for (const project of projects) {
    const ids = crafts
      .filter((craft) => projectMatchesCraft(project, craft))
      .map((craft) => craft.id);

    for (let i = 0; i < ids.length; i += 1) {
      for (let j = i + 1; j < ids.length; j += 1) {
        const pair = pairKey(ids[i] ?? "", ids[j] ?? "");
        weight.set(pair, (weight.get(pair) ?? 0) + 1);
      }
    }
  }

  const best = new Map<string, { other: string; count: number }>();

  for (const [pair, count] of weight) {
    const [left, right] = pair.split("|");

    if (!left || !right) {
      continue;
    }

    const consider = (id: string, other: string) => {
      const current = best.get(id);

      if (!current || count > current.count) {
        best.set(id, { other, count });
      }
    };

    consider(left, right);
    consider(right, left);
  }

  const seen = new Set<string>();
  const bonds: Array<[string, string]> = [];

  for (const [id, { other }] of best) {
    const pair = pairKey(id, other);

    if (seen.has(pair)) {
      continue;
    }

    seen.add(pair);
    bonds.push([id, other]);
  }

  return bonds;
}

export function filterSpiralNodes(nodes: SpiralNodeData[], query: string): SpiralNodeData[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return nodes;
  }

  return nodes.filter((node) => node.searchText.includes(normalized));
}
