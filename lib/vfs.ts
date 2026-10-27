export type VFSNode = VFSFile | VFSDirectory;

export interface VFSFile {
  type: "file";
  name: string;
  content: string;
}

export interface VFSDirectory {
  type: "directory";
  name: string;
  children: Record<string, VFSNode>;
}

export const HOME_PATH = "/home/lovepreet";

const experience = {
  name: "Lovepreet Parmar",
  location: "Chandigarh, India",
  education: [
    {
      institution: "Chandigarh Engineering College",
      credential: "Bachelor's, Information Technology",
      years: "2015-2019",
    },
  ],
  experience: [
    {
      role: "Senior Software Engineer",
      organization: "LPSynch",
      start: "2023-11",
      end: null,
      focus: "Web engineering and product delivery",
    },
    {
      role: "Software Developer",
      organization: "Upwork",
      start: "2023-02",
      end: "2023-10",
      focus: "Client engineering work",
    },
    {
      role: "Senior Web Developer",
      organization: "Wartiz Technologies",
      start: "2019-05",
      end: "2023-02",
      focus: "Web applications and APIs",
    },
    {
      role: "Web Developer Intern",
      organization: "Impinge Solutions",
      start: "2019-01",
      end: "2019-06",
      focus: "PHP, MySQL, and front-end integration",
    },
    {
      role: "Graphic Designer",
      organization: "Socialbangbang.com",
      start: "2016-09",
      end: "2016-10",
      location: "Chandigarh",
      focus: "Illustration and visual design",
    },
  ],
};

function file(name: string, content: string): VFSFile {
  return { type: "file", name, content: content.replace(/^\n/, "").replace(/\n$/, "") + "\n" };
}

function directory(name: string, nodes: VFSNode[]): VFSDirectory {
  return {
    type: "directory",
    name,
    children: Object.fromEntries(nodes.map((node) => [node.name, node])),
  };
}

const root = directory("", [
  directory("home", [
    directory("lovepreet", [
      file(
        "about.txt",
        `
Lovepreet Parmar
Software engineer and builder
Chandigarh, India

I am an illustrator and developer based in Chandigarh, originally from New Delhi. I like learning a new tool by shipping something with it, and I care about the path from an interface down to the system underneath.

This desktop, LP OS, is that kind of project: a portfolio you can navigate like a machine.

Interests include coding, music, travel, and Android ROM testing.
`,
      ),
      file("experience.json", JSON.stringify(experience, null, 2)),
      directory("skills", [
        file(
          "frontend.txt",
          `
React
Next.js
TypeScript
Tailwind CSS
UI/UX

Also shipped with React Native, JavaScript, HTML, and CSS.
`,
        ),
        file(
          "backend.txt",
          `
Node.js
APIs
Systems
Databases

Also shipped with PHP, MySQL, and Express.
`,
        ),
        file(
          "tools.txt",
          `
Git
Docker
Cursor
Linux / Android ROM testing
`,
        ),
      ]),
      directory("projects", [
        file(
          "portfolio.md",
          `
# LP OS

A web operating system for this portfolio. The desktop is a Next.js App Router app written in TypeScript and styled with Tailwind CSS.

## Window manager

\`useOSStore\` (Zustand) keeps the window registry, the active window, and \`maxZIndex\`.

Each window tracks:

- id, title, icon, componentId
- isOpen, isMinimized, isMaximized
- position, size, zIndex

\`openWindow\`, \`closeWindow\`, \`minimizeWindow\`, \`toggleMaximize\`, \`focusWindow\`, and \`updatePosition\` drive the shell. \`WindowFrame\` drags from the title bar with pointer events. The taskbar focuses a running app, or minimizes it when it is already in front.

## Files and terminal

Portfolio content lives in an in-memory virtual file system rooted at \`/home/lovepreet\`. The terminal resolves \`~\`, \`..\`, and absolute paths against that tree, then reads it with \`ls\`, \`cd\`, and \`cat\`. \`open <app>\` asks the window manager to raise About Me, Projects, Terminal, or Resume.
`,
        ),
        file(
          "recent-work.txt",
          `
LP OS
  This desktop portfolio: window manager, virtual file system, and terminal.

Public repositories
  TodoApp
    Todo application using React, Firebase, Express, and Material UI.
  weatherapp
  lovepreetparmar.github.io
    Earlier portfolio site, including a PHP e-commerce project and a resume site.
  TypeScript projects
    fitguide, fitbros, slate, lpportfolio, lpsynch, arportfolio,
    lovepreet-portfolio-tech-design

Client and product engineering
  Senior software engineer at LPSynch.
  Software developer on Upwork.
  Senior web developer at Wartiz Technologies.
  Web developer intern at Impinge Solutions, working with PHP and MySQL.
`,
        ),
      ]),
      file(
        "contact.txt",
        `
Email     lplovepreetparmar@gmail.com
LinkedIn  https://www.linkedin.com/in/lovepreetparmar
GitHub    https://github.com/lovepreetparmar
Twitter   not published
`,
      ),
    ]),
  ]),
]);

function normalizePath(path: string): string {
  const stack: string[] = [];

  for (const part of path.split("/")) {
    if (part === "" || part === ".") {
      continue;
    }

    if (part === "..") {
      stack.pop();
      continue;
    }

    stack.push(part);
  }

  return `/${stack.join("/")}`;
}

export function resolvePath(currentPath: string, targetPath: string): string {
  const target = targetPath.trim();

  if (target === "") {
    return normalizePath(currentPath);
  }

  if (target === "~" || target.startsWith("~/")) {
    const homeTarget = target === "~" ? HOME_PATH : `${HOME_PATH}${target.slice(1)}`;
    return normalizePath(homeTarget);
  }

  if (target.startsWith("/")) {
    return normalizePath(target);
  }

  return normalizePath(`${normalizePath(currentPath)}/${target}`);
}

export function readNode(path: string): VFSNode | null {
  const normalized = normalizePath(path);

  if (normalized === "/") {
    return root;
  }

  let current: VFSNode = root;

  for (const part of normalized.split("/").filter(Boolean)) {
    if (current.type !== "directory") {
      return null;
    }

    const next: VFSNode | undefined = current.children[part];

    if (!next) {
      return null;
    }

    current = next;
  }

  return current;
}

export function listDirectory(path: string): string[] {
  const node = readNode(path);

  if (!node || node.type !== "directory") {
    return [];
  }

  return Object.keys(node.children).sort((a, b) => a.localeCompare(b));
}

export function displayPath(path: string): string {
  const normalized = normalizePath(path);

  if (normalized === HOME_PATH) {
    return "~";
  }

  if (normalized.startsWith(`${HOME_PATH}/`)) {
    return `~${normalized.slice(HOME_PATH.length)}`;
  }

  return normalized;
}
