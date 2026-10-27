import { DESKTOP_APPS } from "@/lib/apps";
import {
  HOME_PATH,
  displayPath,
  listDirectory,
  readNode,
  resolvePath,
} from "@/lib/vfs";

export type TerminalTheme = "matrix" | "dark" | "amber";

export type SegmentTone = "directory" | "error" | "accent" | "muted";

export interface TerminalSegment {
  text: string;
  tone?: SegmentTone;
}

export interface TerminalLine {
  segments: TerminalSegment[];
}

export interface CommandResult {
  lines: TerminalLine[];
  cwd?: string;
  clear?: boolean;
  theme?: TerminalTheme;
  openAppId?: string;
}

const THEMES: TerminalTheme[] = ["matrix", "dark", "amber"];

const APP_ALIASES: Record<string, string> = {
  about: "about",
  "about-me": "about",
  "about me": "about",
  projects: "projects",
  project: "projects",
  terminal: "terminal",
  resume: "resume",
};

const HELP = [
  ["help", "List available commands"],
  ["ls [path]", "List files and directories"],
  ["cd <path>", "Change directory"],
  ["cat <file>", "Print a file"],
  ["pwd", "Print the working directory"],
  ["clear", "Clear the screen"],
  ["whoami", "Print the current user"],
  ["theme [name]", "Set matrix, dark, or amber"],
  ["open <app>", "Open a desktop app"],
  ["contact", "Show contact links"],
  ["date", "Print the current time"],
] as const;

function line(...segments: TerminalSegment[]): TerminalLine {
  return { segments };
}

function text(value: string, tone?: SegmentTone): TerminalSegment {
  return tone ? { text: value, tone } : { text: value };
}

function output(value: string, tone?: SegmentTone): CommandResult {
  return { lines: [line(text(value, tone))] };
}

function tokenize(input: string): string[] {
  const matches = input.match(/(?:"[^"]*"|'[^']*'|\S+)/g) ?? [];

  return matches.map((token) => {
    if (
      (token.startsWith('"') && token.endsWith('"') && token.length >= 2) ||
      (token.startsWith("'") && token.endsWith("'") && token.length >= 2)
    ) {
      return token.slice(1, -1);
    }

    return token;
  });
}

function notFound(command: string): CommandResult {
  return output(
    `command not found: ${command}. Type "help" for a list of commands.`,
    "error",
  );
}

function listEntries(path: string): TerminalLine[] {
  const names = listDirectory(path);
  const directories: string[] = [];
  const files: string[] = [];

  for (const name of names) {
    const child = readNode(resolvePath(path, name));

    if (child?.type === "directory") {
      directories.push(name);
    } else {
      files.push(name);
    }
  }

  return [...directories, ...files].map((name) => {
    const child = readNode(resolvePath(path, name));
    const isDirectory = child?.type === "directory";

    return line(text(isDirectory ? `${name}/` : name, isDirectory ? "directory" : undefined));
  });
}

function runLs(cwd: string, args: string[]): CommandResult {
  if (args.length > 1) {
    return output("ls: too many arguments", "error");
  }

  const target = args[0] ?? ".";
  const path = resolvePath(cwd, target);
  const node = readNode(path);

  if (!node) {
    return output(`ls: cannot access '${target}': No such file or directory`, "error");
  }

  if (node.type === "file") {
    return output(node.name);
  }

  const entries = listEntries(path);

  return { lines: entries.length > 0 ? entries : [line(text(""))] };
}

function runCd(cwd: string, args: string[]): CommandResult {
  if (args.length > 1) {
    return output("cd: too many arguments", "error");
  }

  const target = args[0] ?? "~";
  const path = resolvePath(cwd, target);
  const node = readNode(path);

  if (!node) {
    return output(`cd: no such file or directory: ${target}`, "error");
  }

  if (node.type !== "directory") {
    return output(`cd: not a directory: ${target}`, "error");
  }

  return { lines: [], cwd: path };
}

function runCat(cwd: string, args: string[]): CommandResult {
  if (args.length === 0) {
    return output("cat: missing file operand", "error");
  }

  if (args.length > 1) {
    return output("cat: too many arguments", "error");
  }

  const target = args[0] ?? "";
  const node = readNode(resolvePath(cwd, target));

  if (!node) {
    return output(`cat: ${target}: No such file or directory`, "error");
  }

  if (node.type === "directory") {
    return output(`cat: ${target}: Is a directory`, "error");
  }

  const rows = node.content.replace(/\n$/, "").split("\n");

  return {
    lines: rows.map((row) => line(text(row))),
  };
}

function runTheme(current: TerminalTheme, args: string[]): CommandResult {
  if (args.length === 0) {
    return {
      lines: [
        line(text(`Current theme: ${current}`)),
        line(text("Themes: matrix, dark, amber")),
      ],
    };
  }

  if (args.length > 1) {
    return output("theme: too many arguments", "error");
  }

  const next = args[0]?.toLowerCase();

  if (!THEMES.includes(next as TerminalTheme)) {
    return output(`theme: unknown theme '${args[0]}'. Try matrix, dark, or amber.`, "error");
  }

  return {
    lines: [line(text(`Theme set to ${next}.`))],
    theme: next as TerminalTheme,
  };
}

function runOpen(args: string[]): CommandResult {
  if (args.length === 0) {
    return output("open: missing app name. Try about, projects, terminal, or resume.", "error");
  }

  const query = args.join(" ").toLowerCase();
  const appId = APP_ALIASES[query];
  const app = DESKTOP_APPS.find((item) => item.id === appId);

  if (!app) {
    return output(
      `open: unknown app '${args.join(" ")}'. Try about, projects, terminal, or resume.`,
      "error",
    );
  }

  return {
    lines: [line(text(`Opening ${app.title}.`))],
    openAppId: app.id,
  };
}

export function formatPrompt(cwd: string): string {
  return `lovepreet@lp-os:${displayPath(cwd)}$ `;
}

export function runCommand(
  input: string,
  context: { cwd: string; theme: TerminalTheme },
): CommandResult {
  const tokens = tokenize(input);

  if (tokens.length === 0) {
    return { lines: [] };
  }

  const [command, ...args] = tokens;
  const name = command?.toLowerCase() ?? "";

  switch (name) {
    case "help":
      return {
        lines: [
          line(text("LP OS commands")),
          line(text("")),
          ...HELP.map(([usage, description]) =>
            line(text(usage.padEnd(16, " ")), text(description, "muted")),
          ),
        ],
      };
    case "ls":
      return runLs(context.cwd, args);
    case "cd":
      return runCd(context.cwd, args);
    case "cat":
      return runCat(context.cwd, args);
    case "pwd":
      if (args.length > 0) {
        return output("pwd: too many arguments", "error");
      }
      return output(resolvePath(context.cwd, "."));
    case "clear":
      if (args.length > 0) {
        return output("clear: too many arguments", "error");
      }
      return { lines: [], clear: true };
    case "whoami":
      if (args.length > 0) {
        return output("whoami: too many arguments", "error");
      }
      return output("lovepreet - Software Engineer & Builder");
    case "theme":
      return runTheme(context.theme, args);
    case "open":
      return runOpen(args);
    case "contact":
      if (args.length > 0) {
        return output("contact: too many arguments", "error");
      }
      return runCat(HOME_PATH, ["contact.txt"]);
    case "date":
      if (args.length > 0) {
        return output("date: too many arguments", "error");
      }
      return output(new Date().toString());
    default:
      return notFound(command ?? input.trim());
  }
}
