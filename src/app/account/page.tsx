export default function AccountPage() {
  return (
    <div className="w-full max-w-2xl text-left">
      <h1 className="font-ui m-0 text-[22px] font-semibold leading-tight text-[var(--color-primary)]">
        Account
      </h1>
      <p className="mt-4 font-ui text-[12px] font-normal uppercase tracking-[0.1em] text-[var(--color-secondary)]">
        Account and session settings
      </p>
      <p className="mt-6 font-ui text-sm font-normal leading-relaxed text-[var(--color-secondary)]">
        Preferences for this workspace will appear here.
      </p>
    </div>
  );
}
