"use client";

import { SpiralOverlayShell } from "@/components/spiral/SpiralOverlayShell";
import {
  formatExperienceRange,
  getAboutProfile,
  getExperienceDocument,
  getSkillGroups,
} from "@/lib/portfolio";

interface SpiralResumeOverlayProps {
  onClose: () => void;
}

export function SpiralResumeOverlay({ onClose }: SpiralResumeOverlayProps) {
  const profile = getAboutProfile();
  const experienceDoc = getExperienceDocument();
  const skills = getSkillGroups();

  if (!experienceDoc) {
    return (
      <SpiralOverlayShell title="Resume" onClose={onClose}>
        <p className="p-8 text-sm text-neutral-600">Resume data is unavailable.</p>
      </SpiralOverlayShell>
    );
  }

  return (
    <SpiralOverlayShell title="Resume" onClose={onClose}>
      <div className="flex justify-end border-b border-black/10 px-6 py-3 lp-no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="text-[11px] tracking-[0.2em] text-neutral-600 uppercase hover:text-neutral-900"
        >
          Print / PDF
        </button>
      </div>
      <article
        data-resume-document
        className="mx-auto max-w-3xl px-6 py-8 text-neutral-900 sm:px-10 sm:py-10"
      >
        <header className="border-b border-black/10 pb-8">
          <h2 className="lp-editorial-display text-4xl">{experienceDoc.name}</h2>
          <p className="mt-3 text-sm text-neutral-600">{experienceDoc.location}</p>
          {profile?.headline ? (
            <p className="mt-2 text-sm text-neutral-700">{profile.headline}</p>
          ) : null}
        </header>

        {profile?.paragraphs[0] ? (
          <section className="mt-10">
            <h3 className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase">Summary</h3>
            <p className="mt-4 max-w-prose text-sm leading-7 text-neutral-700">
              {profile.paragraphs[0]}
            </p>
          </section>
        ) : null}

        <section className="mt-12">
          <h3 className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase">Experience</h3>
          <ol className="mt-6 space-y-8">
            {experienceDoc.experience.map((entry) => (
              <li key={`${entry.organization}-${entry.start}`}>
                <p className="text-sm font-medium text-neutral-900">{entry.role}</p>
                <p className="text-sm text-neutral-600">{entry.organization}</p>
                <p className="mt-1 font-mono text-[11px] text-neutral-400">
                  {formatExperienceRange(entry.start, entry.end)}
                  {entry.location ? ` · ${entry.location}` : ""}
                </p>
                {entry.focus ? (
                  <p className="mt-3 text-sm leading-6 text-neutral-700">{entry.focus}</p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase">Education</h3>
            <ul className="mt-4 space-y-4">
              {experienceDoc.education.map((entry) => (
                <li key={entry.institution}>
                  <p className="text-sm font-medium">{entry.institution}</p>
                  <p className="text-sm text-neutral-600">{entry.credential}</p>
                  <p className="text-xs text-neutral-400">{entry.years}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] tracking-[0.4em] text-neutral-400 uppercase">Skills</h3>
            <div className="mt-4 space-y-4">
              {skills.map((group) => (
                <div key={group.id}>
                  <p className="text-xs text-neutral-500">{group.title}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-700">
                    {group.items.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </article>
    </SpiralOverlayShell>
  );
}
