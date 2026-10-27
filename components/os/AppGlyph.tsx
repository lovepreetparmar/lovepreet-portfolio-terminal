import type { ReactNode } from "react";
import type { AppIconName } from "@/types/os";

const tileStyles: Record<AppIconName, string> = {
  about: "text-sky-300",
  projects: "text-violet-300",
  terminal: "text-emerald-300",
  resume: "text-amber-200",
};

interface GlyphProps {
  name: AppIconName;
  className?: string;
}

export function AppGlyph({ name, className }: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="currentColor"
    >
      {glyphs[name]}
    </svg>
  );
}

const glyphs: Record<AppIconName, ReactNode> = {
  about: (
    <>
      <circle cx="12" cy="7.6" r="3.05" />
      <path d="M6.35 18.7c.85-2.85 2.95-4.25 5.65-4.25s4.8 1.4 5.65 4.25c.18.6-.28 1.2-.92 1.2H7.27c-.64 0-1.1-.6-.92-1.2Z" />
    </>
  ),
  projects: (
    <>
      <rect x="3.6" y="3.6" width="7.1" height="7.1" rx="1.7" />
      <rect x="13.3" y="3.6" width="7.1" height="7.1" rx="1.7" opacity="0.62" />
      <rect x="3.6" y="13.3" width="7.1" height="7.1" rx="1.7" opacity="0.84" />
      <rect x="13.3" y="13.3" width="7.1" height="7.1" rx="1.7" opacity="0.42" />
    </>
  ),
  terminal: (
    <path
      fillRule="evenodd"
      d="M6 6.4h12c.94 0 1.7.76 1.7 1.7v8.2c0 .94-.76 1.7-1.7 1.7H6c-.94 0-1.7-.76-1.7-1.7V8.1c0-.94.76-1.7 1.7-1.7Zm1.05 2.85 2.85 2.75-2.85 2.75 1.15 1.15 4-3.9-4-3.9-1.15 1.15Zm5.15 5.35h4.55v1.25H12.2v-1.25Z"
    />
  ),
  resume: (
    <path
      fillRule="evenodd"
      d="M7.15 4.35h6.55l4.55 4.35v10.15c0 .8-.65 1.45-1.45 1.45H7.15c-.8 0-1.45-.65-1.45-1.45V5.8c0-.8.65-1.45 1.45-1.45Zm6.15 1.35v3.15h3.35L13.3 5.7ZM8.7 12.15h6.6v1.15H8.7v-1.15Zm0 2.85h4.7v1.15H8.7V15Z"
    />
  ),
};

export function AppTile({ name, className = "" }: GlyphProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden border border-white/10 bg-gradient-to-b from-[#2a3142] to-[#141820] shadow-[0_8px_16px_rgba(0,0,0,0.28)] ${tileStyles[name]} ${className}`}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/12 to-transparent" />
      <span className="pointer-events-none absolute inset-x-2 top-0 h-px bg-white/35" />
      <AppGlyph name={name} className="relative h-1/2 w-1/2" />
    </span>
  );
}
