const placeholders = [
  {
    name: "Project One",
    detail: "Case study placeholder. Content lands in a later step.",
  },
  {
    name: "Project Two",
    detail: "Case study placeholder. Content lands in a later step.",
  },
  {
    name: "Project Three",
    detail: "Case study placeholder. Content lands in a later step.",
  },
];

export function ProjectsApp() {
  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Projects</h2>
        <p className="mt-1 text-sm text-white/55">
          A preview grid so this window has something to drag around.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {placeholders.map((project) => (
          <li
            key={project.name}
            className="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <p className="text-sm font-medium text-white/90">{project.name}</p>
            <p className="mt-1 text-sm leading-5 text-white/55">{project.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
