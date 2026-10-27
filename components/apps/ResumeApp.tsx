const sections = ["Experience", "Selected work", "Skills"];

export function ResumeApp() {
  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Resume</h2>
        <p className="mt-1 text-sm text-white/55">
          Placeholder document. The real resume can replace this layout later.
        </p>
      </div>
      {sections.map((section) => (
        <section
          key={section}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <h3 className="text-sm font-medium text-white/85">{section}</h3>
          <p className="mt-1 text-sm text-white/45">Content coming soon.</p>
        </section>
      ))}
    </div>
  );
}
