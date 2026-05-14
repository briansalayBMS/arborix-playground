export default function UserValuesPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-ui m-0 text-[32px] font-bold leading-tight text-[var(--color-primary)]">
        User Values
      </h1>
      <p className="m-0 max-w-2xl text-base font-normal leading-relaxed text-[var(--color-secondary)]">
        Your value statements — edit and verify through your record. Use{" "}
        <a className="text-[var(--color-blue)] underline-offset-2 hover:underline" href="/ingest">
          Ingest
        </a>{" "}
        to mount artifacts.
      </p>
    </div>
  );
}
