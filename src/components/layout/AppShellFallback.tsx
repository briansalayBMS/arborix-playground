import Image from "next/image";
import { IDENTITY_ANCHOR } from "@/constants/identityAnchor";

/** Static shell shown while the client AppShell hydrates (Suspense fallback). */
export function AppShellFallback({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed top-0 bottom-0 left-[var(--nav-gutter)] z-40 flex w-[var(--nav-w)] flex-col border-r border-[var(--color-arborix-line)] bg-[color-mix(in_srgb,var(--color-arborix-bg)_92%,white)] backdrop-blur-md">
        <div className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-10">
          <div className="mb-14 flex justify-start">
            <Image
              src="/arborix-logo.png"
              alt="Arborix"
              width={40}
              height={48}
              priority
              className="h-12 w-auto"
            />
          </div>
          <div className="mono-label flex flex-col gap-3 text-[var(--color-arborix-text)]/35">
            <span>YOU</span>
            <span>COMPANY</span>
            <span>WORK</span>
          </div>
        </div>
        <div className="shrink-0 border-t-[0.5px] border-[#E2E8F0] bg-white p-4 text-left">
          <div className="flex items-start gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#131517] font-code text-[12px] font-medium text-white"
              aria-hidden
            >
              {IDENTITY_ANCHOR.initials}
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="m-0 font-ui text-[14px] font-semibold leading-tight text-[#131517]">
                {IDENTITY_ANCHOR.name}
              </p>
              <p className="m-0 mt-1 font-code text-[10px] font-normal leading-snug text-[#64748B]">
                {IDENTITY_ANCHOR.title}
              </p>
            </div>
          </div>
        </div>
      </aside>
      <main className="min-h-screen min-w-0 flex-1 bg-white px-8 py-12 ml-[var(--main-with-nav-ml)]">
        <div className="w-full max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
