import type { ReactNode } from "react";
import type { AppIconName } from "@/types/os";

interface GlyphProps {
  name: AppIconName;
  className?: string;
}

export function AppGlyph({ name, className }: GlyphProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {glyphs[name]}
    </svg>
  );
}

const glyphs: Record<AppIconName, ReactNode> = {
  about: (
    <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <circle cx="12" cy="8.5" r="3.2" fill="currentColor" fillOpacity="0.12" />
      <path d="M6 18.5c1-3 3.2-4.5 6-4.5s5 1.5 6 4.5" />
      <path d="M12 5.5v1" strokeOpacity="0.5" />
    </g>
  ),
  projects: (
    <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round">
      <path d="M5 10h14v9H5z" fill="currentColor" fillOpacity="0.08" />
      <path d="M9 10V7.5h3.5L14 10h5" />
      <path d="M8.5 14h7M8.5 16.5h4" strokeOpacity="0.65" />
    </g>
  ),
  terminal: (
    <g fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">
      <rect x="5" y="6" width="14" height="12" rx="1" fill="currentColor" fillOpacity="0.06" />
      <path d="M7.5 11 10.5 13.5 7.5 16" />
      <path d="M12.5 16h5" />
    </g>
  ),
  resume: (
    <g fill="none" stroke="currentColor" strokeWidth="1.35">
      <path d="M7 4.5h6.5L18 8.5v11H7z" fill="currentColor" fillOpacity="0.08" />
      <path d="M13.5 4.5V8H18" />
      <path d="M9.5 12.5h5M9.5 15h3.5" strokeOpacity="0.7" />
    </g>
  ),
};

export function AppTile({ name, className = "" }: GlyphProps) {
  return (
    <span
      className={`inline-flex items-center justify-center border border-[var(--lp-border-warm)] bg-[var(--lp-surface)] ${className}`}
    >
      <AppGlyph name={name} className="h-[58%] w-[58%] text-[var(--lp-accent-soft)]" />
    </span>
  );
}
