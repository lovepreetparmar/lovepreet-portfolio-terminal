"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  formatPrompt,
  runCommand,
  type TerminalLine,
  type TerminalTheme,
} from "@/lib/terminal";
import { HOME_PATH } from "@/lib/vfs";
import { useOSStore } from "@/store/useOSStore";

interface HistoryEntry {
  id: number;
  cwd: string;
  command: string;
  lines: TerminalLine[];
}

const themes: Record<
  TerminalTheme,
  {
    shell: string;
    font: string;
    text: string;
    prompt: string;
    directory: string;
    error: string;
    accent: string;
    muted: string;
    cursor: string;
  }
> = {
  matrix: {
    shell: "bg-black text-emerald-300",
    font: "font-mono",
    text: "text-emerald-300",
    prompt: "text-emerald-100",
    directory: "text-cyan-300",
    error: "text-red-400",
    accent: "text-emerald-100",
    muted: "text-emerald-600",
    cursor: "bg-emerald-300",
  },
  dark: {
    shell: "bg-[#0b0d12] text-zinc-200",
    font: "[font-family:var(--font-geist-mono),ui-monospace,monospace]",
    text: "text-zinc-200",
    prompt: "text-sky-300",
    directory: "text-cyan-300",
    error: "text-rose-400",
    accent: "text-sky-200",
    muted: "text-zinc-500",
    cursor: "bg-zinc-100",
  },
  amber: {
    shell: "bg-[#140e06] text-amber-200",
    font: "[font-family:Courier_New,Courier,monospace]",
    text: "text-amber-200",
    prompt: "text-amber-50",
    directory: "text-cyan-300",
    error: "text-red-400",
    accent: "text-amber-50",
    muted: "text-amber-700",
    cursor: "bg-amber-200",
  },
};

const welcome: TerminalLine[] = [
  { segments: [{ text: "LP OS terminal" }] },
  {
    segments: [
      { text: "Type " },
      { text: "help", tone: "accent" },
      { text: " to see commands. Home is ~/." },
    ],
  },
  { segments: [{ text: "" }] },
];

export function TerminalApp() {
  const openWindow = useOSStore((state) => state.openWindow);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const idRef = useRef(1);
  const draftRef = useRef("");
  const [cwd, setCwd] = useState(HOME_PATH);
  const [theme, setTheme] = useState<TerminalTheme>("dark");
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState(0);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const palette = themes[theme];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const viewport = scrollRef.current;

    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [entries, input, cwd]);

  const placeCaret = (value: string, position = value.length) => {
    setCursor(position);
    requestAnimationFrame(() => {
      const element = inputRef.current;

      if (!element) {
        return;
      }

      element.setSelectionRange(position, position);
    });
  };

  const execute = (raw: string) => {
    const command = raw.trim();
    const result = runCommand(command, { cwd, theme });

    if (result.clear) {
      setEntries([]);
    } else {
      const id = idRef.current;
      idRef.current += 1;
      setEntries((current) => [
        ...current,
        { id, cwd, command, lines: result.lines },
      ]);
    }

    if (result.cwd) {
      setCwd(result.cwd);
    }

    if (result.theme) {
      setTheme(result.theme);
    }

    if (result.openAppId) {
      openWindow(result.openAppId);
    }

    if (command) {
      setCommandHistory((current) => [...current, command]);
    }

    setHistoryIndex(-1);
    draftRef.current = "";
    setInput("");
    placeCaret("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      execute(event.currentTarget.value);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (commandHistory.length === 0) {
        return;
      }

      const nextIndex =
        historyIndex < 0 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);

      if (historyIndex < 0) {
        draftRef.current = input;
      }

      const recalled = commandHistory[nextIndex] ?? "";
      setHistoryIndex(nextIndex);
      setInput(recalled);
      placeCaret(recalled);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (historyIndex < 0) {
        return;
      }

      const nextIndex = historyIndex + 1;

      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput(draftRef.current);
        placeCaret(draftRef.current);
        return;
      }

      const recalled = commandHistory[nextIndex] ?? "";
      setHistoryIndex(nextIndex);
      setInput(recalled);
      placeCaret(recalled);
    }
  };

  const syncCursor = (element: HTMLInputElement) => {
    setCursor(element.selectionStart ?? element.value.length);
  };

  return (
    <div
      className={`h-full ${palette.shell} ${palette.font}`}
      onPointerDown={() => inputRef.current?.focus()}
    >
      <div
        ref={scrollRef}
        className="h-full overflow-auto px-4 py-3 text-[13px] leading-6"
      >
        <div role="log" aria-live="polite" aria-relevant="additions">
          <Output lines={welcome} palette={palette} />
          {entries.map((entry) => (
            <div key={entry.id}>
              <p className="whitespace-pre-wrap">
                <span className={palette.prompt}>{formatPrompt(entry.cwd)}</span>
                <span>{entry.command}</span>
              </p>
              <Output lines={entry.lines} palette={palette} />
            </div>
          ))}
        </div>
        <form
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="flex items-start">
            <span className={`shrink-0 whitespace-pre ${palette.prompt}`}>
              {formatPrompt(cwd)}
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="pointer-events-none relative whitespace-pre">
                {input || " "}
                <span
                  aria-hidden="true"
                  className={`lp-caret absolute top-[3px] inline-block h-[1.05em] w-[0.62ch] ${palette.cursor}`}
                  style={{ left: `${cursor}ch` }}
                />
              </span>
              <input
                ref={inputRef}
                data-terminal-input
                aria-label="Terminal command"
                value={input}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="off"
                onChange={(event) => {
                  setInput(event.target.value);
                  syncCursor(event.target);
                }}
                onKeyDown={onKeyDown}
                onKeyUp={(event) => {
                  if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    return;
                  }

                  syncCursor(event.currentTarget);
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  syncCursor(event.currentTarget);
                }}
                onSelect={(event) => syncCursor(event.currentTarget)}
                className="absolute inset-0 w-full bg-transparent text-transparent caret-transparent outline-none"
              />
            </span>
          </label>
        </form>
      </div>
    </div>
  );
}

function Output({
  lines,
  palette,
}: {
  lines: TerminalLine[];
  palette: (typeof themes)[TerminalTheme];
}) {
  return lines.map((row, index) => (
    <p key={`${index}-${row.segments.map((segment) => segment.text).join("")}`} className="whitespace-pre-wrap">
      {row.segments.map((segment, segmentIndex) => (
        <span
          key={`${segmentIndex}-${segment.text}`}
          className={toneClass(segment.tone, palette)}
        >
          {segment.text}
        </span>
      ))}
    </p>
  ));
}

function toneClass(
  tone: TerminalLine["segments"][number]["tone"],
  palette: (typeof themes)[TerminalTheme],
) {
  switch (tone) {
    case "directory":
      return palette.directory;
    case "error":
      return palette.error;
    case "accent":
      return palette.accent;
    case "muted":
      return palette.muted;
    default:
      return palette.text;
  }
}
