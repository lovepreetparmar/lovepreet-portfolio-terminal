"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { AppGlyph } from "@/components/os/AppGlyph";
import { filterPaletteItems, type PaletteItem } from "@/lib/command-palette";
import { useOSStore } from "@/store/useOSStore";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  if (!open) {
    return null;
  }

  return <CommandPalettePanel onClose={onClose} />;
}

function CommandPalettePanel({ onClose }: { onClose: () => void }) {
  const openWindow = useOSStore((state) => state.openWindow);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = useMemo(() => filterPaletteItems(query), [query]);
  const activeIndex = Math.min(selectedIndex, Math.max(items.length - 1, 0));

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const activate = (item: PaletteItem) => {
    if (item.action.type === "open-app") {
      openWindow(item.action.appId);
    }

    onClose();
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSelectedIndex((index) =>
        Math.min(index + 1, Math.max(items.length - 1, 0)),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === "Enter" && items[activeIndex]) {
      event.preventDefault();
      activate(items[activeIndex]);
    }
  };

  useEffect(() => {
    const option = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    option?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, items.length]);

  return (
    <div
      className="lp-no-print fixed inset-0 z-[100] flex items-start justify-center bg-neutral-900/25 p-4 pt-[12vh] backdrop-blur-sm"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="lp-palette-in w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.12)]"
      >
        <div className="border-b border-neutral-200 px-4 py-3">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder="Search applications…"
            aria-controls="lp-command-list"
            aria-activedescendant={
              items[activeIndex] ? `lp-command-${items[activeIndex].id}` : undefined
            }
            className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
          />
        </div>
        <ul id="lp-command-list" ref={listRef} className="max-h-72 overflow-auto p-2">
          {items.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-neutral-500">
              No matching applications.
            </li>
          ) : (
            items.map((item, index) => (
              <li key={item.id}>
                <button
                  id={`lp-command-${item.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onClick={() => activate(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`lp-focus-ring flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition ${
                    index === activeIndex
                      ? "bg-neutral-100 ring-1 ring-inset ring-neutral-200"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100">
                    <AppGlyph name={item.icon} className="h-4 w-4 text-neutral-700" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-neutral-900">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-neutral-500">
                      {item.description}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2 text-[10px] text-neutral-500">
          <span>Navigate ↑↓ · Enter to open</span>
          <span>
            <kbd className="rounded border border-neutral-200 px-1">Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
