"use client";

import { AppScroll } from "@/components/ui/AppSurface";
import {
  getAboutProfile,
  getContactLinks,
  getSkillGroups,
} from "@/lib/portfolio";

export function AboutApp() {
  const profile = getAboutProfile();
  const contact = getContactLinks();
  const skills = getSkillGroups();

  if (!profile) {
    return (
      <AppScroll>
        <p className="p-6 text-sm text-white/60">Profile content is unavailable.</p>
      </AppScroll>
    );
  }

  return (
    <AppScroll>
      <div className="grid min-h-full lg:grid-cols-[1.2fr_0.8fr]">
        <section className="border-b border-[var(--lp-border)] px-6 py-8 lg:border-r lg:border-b-0 lg:px-10 lg:py-10">
          <p className="text-[10px] tracking-[0.45em] text-white/38 uppercase">Profile</p>
          <h2 className="lp-editorial-display mt-4 text-3xl text-white sm:text-4xl">
            {profile.name}
          </h2>
          <p className="mt-3 text-sm text-[var(--lp-accent)]">{profile.headline}</p>
          {profile.location ? (
            <p className="mt-1 text-xs text-white/40">{profile.location}</p>
          ) : null}

          <div className="mt-10 max-w-prose space-y-5 border-l border-white/10 pl-6">
            {profile.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)} className="text-sm leading-7 text-white/68">
                {paragraph}
              </p>
            ))}
          </div>

          {profile.interestsLine ? (
            <p className="mt-10 text-xs leading-6 tracking-wide text-white/42">
              {profile.interestsLine}
            </p>
          ) : null}
        </section>

        <aside className="space-y-10 px-6 py-8 lg:px-8 lg:py-10">
          {skills.map((group) => (
            <div key={group.id}>
              <h3 className="text-[10px] tracking-[0.35em] text-white/35 uppercase">
                {group.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                {group.items.join(" · ")}
              </p>
            </div>
          ))}

          {contact.length > 0 ? (
            <div>
              <h3 className="text-[10px] tracking-[0.35em] text-white/35 uppercase">Contact</h3>
              <ul className="mt-4 space-y-3">
                {contact.map((link) => (
                  <li key={link.label} className="text-sm">
                    <span className="text-white/35">{link.label}</span>
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
                        className="text-[var(--lp-accent)] underline-offset-4 hover:underline"
                      >
                        {link.value}
                      </a>
                    ) : (
                      <span className="text-white/55">{link.value}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </AppScroll>
  );
}
