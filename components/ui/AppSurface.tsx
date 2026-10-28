import type { ReactNode } from "react";

export function AppScroll({ children }: { children: ReactNode }) {
  return (
    <div className="lp-app-scroll h-full overflow-auto bg-[var(--lp-surface)] text-[var(--lp-text)]">
      {children}
    </div>
  );
}

export function AppSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--lp-border)] bg-[var(--lp-surface-elevated)] p-4">
      <h3 className="text-sm font-medium tracking-tight text-[var(--lp-text)]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}
