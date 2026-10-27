export function AboutApp() {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 text-lg font-semibold text-white shadow-lg">
          LP
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Lovepreet Parmar
          </h2>
          <p className="text-sm text-white/55">About Me</p>
        </div>
      </div>
      <p className="max-w-prose text-sm leading-6 text-white/75">
        This window is a placeholder for the About Me app. Use it to check that
        windows open, come forward, drag from the title bar, minimize, and close.
      </p>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Info label="Desktop" value="LP OS" />
        <Info label="Status" value="Shell preview" />
      </dl>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <dt className="text-[11px] tracking-wide text-white/40 uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-white/85">{value}</dd>
    </div>
  );
}
