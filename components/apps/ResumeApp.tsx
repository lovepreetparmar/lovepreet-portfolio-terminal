"use client";

import { AppScroll } from "@/components/ui/AppSurface";
import {
  formatExperienceRange,
  getAboutProfile,
  getExperienceDocument,
  getSkillGroups,
} from "@/lib/portfolio";

export function ResumeApp() {
  const profile = getAboutProfile();
  const experienceDoc = getExperienceDocument();
  const skills = getSkillGroups();

  if (!experienceDoc) {
    return (
      <AppScroll>
        <p className="p-6 text-sm text-white/60">Resume data is unavailable.</p>
      </AppScroll>
    );
  }

  return (
    <AppScroll>
      <div className="flex justify-end border-b border-[var(--lp-border)] px-6 py-3 lp-no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="lp-text-button lp-focus-ring"
        >
          Print / Save as PDF
        </button>
      </div>
      <article
        data-resume-document
        className="mx-auto max-w-3xl px-6 py-8 text-white sm:px-10 sm:py-10"
      >
        <header className="border-b border-[var(--lp-border)] pb-8">
          <h2 className="lp-editorial-display text-4xl tracking-tight">{experienceDoc.name}</h2>
          <p className="mt-3 text-sm text-white/50">{experienceDoc.location}</p>
          {profile?.headline ? (
            <p className="mt-2 text-sm text-[var(--lp-accent)]">{profile.headline}</p>
          ) : null}
        </header>

        {profile?.paragraphs[0] ? (
          <section className="mt-10">
            <h3 className="text-[10px] tracking-[0.4em] text-white/35 uppercase">Summary</h3>
            <p className="mt-4 max-w-prose text-sm leading-7 text-white/68">
              {profile.paragraphs[0]}
            </p>
          </section>
        ) : null}

        <section className="mt-12">
          <h3 className="text-[10px] tracking-[0.4em] text-white/35 uppercase">Experience</h3>
          <ol className="mt-6 space-y-8">
            {experienceDoc.experience.map((entry) => (
              <li key={`${entry.organization}-${entry.start}`}>
                <p className="text-sm font-medium text-white/92">{entry.role}</p>
                <p className="text-sm text-white/55">{entry.organization}</p>
                <p className="mt-1 font-mono text-[11px] text-white/38">
                  {formatExperienceRange(entry.start, entry.end)}
                  {entry.location ? ` · ${entry.location}` : ""}
                </p>
                {entry.focus ? (
                  <p className="mt-3 text-sm leading-6 text-white/62">{entry.focus}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="text-[10px] tracking-[0.4em] text-white/35 uppercase">Education</h3>
            <ul className="mt-4 space-y-4">
              {experienceDoc.education.map((entry) => (
                <li key={entry.institution}>
                  <p className="text-sm font-medium text-white/90">{entry.institution}</p>
                  <p className="text-sm text-white/55">{entry.credential}</p>
                  <p className="text-xs text-white/38">{entry.years}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] tracking-[0.4em] text-white/35 uppercase">Skills</h3>
            <div className="mt-4 space-y-4">
              {skills.map((group) => (
                <div key={group.id}>
                  <p className="text-xs text-white/45">{group.title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/72">
                    {group.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </AppScroll>
  );
}
