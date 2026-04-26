type InstrumentPlaceholderProps = {
  kicker: string;
  title: string;
  description?: string;
};

export function InstrumentPlaceholder({
  kicker,
  title,
  description = "Placeholder instrument — wiring next.",
}: InstrumentPlaceholderProps) {
  return (
    <div className="space-y-4">
      <p className="mono-label text-[var(--color-arborix-text)]/50">{kicker}</p>
      <h1 className="text-2xl font-medium tracking-tight text-[var(--color-arborix-text)]">
        {title}
      </h1>
      <p className="max-w-xl text-sm leading-relaxed text-[var(--color-arborix-text)]/60">
        {description}
      </p>
    </div>
  );
}
