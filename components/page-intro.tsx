// The top of every page: optional eyebrow label → H1 → one-line description.

export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <div className="prose-width">
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-muted-ink">{description}</p>
    </div>
  );
}

/** Standard page body width and spacing (design.md: ≥40px mobile, ≥64px desktop). */
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10 sm:py-16">
      {children}
    </main>
  );
}
