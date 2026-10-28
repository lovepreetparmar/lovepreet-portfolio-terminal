"use client";

import { SpiralOverlayShell } from "@/components/spiral/SpiralOverlayShell";
import {
  getAboutProfile,
  getContactLinks,
  getSkillGroups,
} from "@/lib/portfolio";

interface SpiralAboutOverlayProps {
  onClose: () => void;
  onOpenResume: () => void;
}

export function SpiralAboutOverlay({ onClose, onOpenResume }: SpiralAboutOverlayProps) {
  const profile = getAboutProfile();
  const contact = getContactLinks();
  const skills = getSkillGroups();

  return (
    <SpiralOverlayShell title={profile?.name ?? "About"} onClose={onClose}>
      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <p className="text-[10px] tracking-[0.45em] text-neutral-500 uppercase">Profile</p>
          <h2 className="lp-editorial-display mt-4 text-4xl text-neutral-900">
            {profile?.name ?? "Lovepreet Parmar"}
          </h2>
          <p className="mt-3 text-sm text-neutral-600">{profile?.headline}</p>
          {profile?.location ? (
            <p className="mt-1 text-xs text-neutral-400">{profile.location}</p>
          ) : null}

          <div className="mt-8 max-w-prose space-y-5 border-l border-black/10 pl-6">
            {profile?.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-sm leading-7 text-neutral-700">
                {paragraph}
              </p>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenResume}
            className="lp-focus-ring mt-8 text-[11px] tracking-[0.2em] text-neutral-600 uppercase underline-offset-4 hover:text-neutral-900 hover:underline"
          >
            View resume
          </button>
        </section>

        <aside className="space-y-8">
          {skills.map((group) => (
            <div key={group.id}>
              <h3 className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase">
                {group.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-neutral-700">
                {group.items.join(" · ")}
              </p>
            </div>
          ))}

          {contact.length > 0 ? (
            <div>
              <h3 className="text-[10px] tracking-[0.35em] text-neutral-400 uppercase">
                Contact
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                {contact.map((link) => (
                  <li key={link.label}>
                    <span className="text-neutral-400">{link.label}</span>
                    {" — "}
                    {link.href ? (
                      <a
                        href={link.href}
                        target={link.label.toLowerCase() === "email" ? undefined : "_blank"}
                        rel={
                          link.label.toLowerCase() === "email"
                            ? undefined
                            : "noopener noreferrer"
                        }
                        className="underline-offset-2 hover:underline"
                      >
                        {link.value}
                      </a>
                    ) : (
                      link.value
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </SpiralOverlayShell>
  );
}
