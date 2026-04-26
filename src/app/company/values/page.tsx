export default function CompanyValuesPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-ui m-0 text-[32px] font-bold leading-tight text-[var(--color-arborix-text)]">
        Company Values
      </h1>
      <p className="m-0 max-w-2xl text-base font-normal leading-relaxed text-[var(--color-arborix-meta)]">
        Organizational value posture versus observed behavior. Mount source artifacts via{" "}
        <a className="text-[var(--color-arborix-accent)] underline-offset-2 hover:underline" href="/ingest">
          Ingest
        </a>
        .
      </p>
    </div>
  );
}
