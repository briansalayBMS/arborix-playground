"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DiagnosticFocusProvider } from "@/context/DiagnosticFocusContext";
import { RightRailDrawerProvider } from "@/context/RightRailDrawerContext";
import { ExternalViewProvider, useExternalView } from "@/context/ExternalViewContext";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import { LeftNav } from "@/components/layout/LeftNav";
import { UtilityDock } from "@/components/layout/UtilityDock";
import { RightRailDrawer } from "@/components/sovereign/RightRailDrawer";
import { CONFLICT_COUNT } from "@/components/layout/GlobalHUD";
import { IDENTITY_ANCHOR } from "@/constants/identityAnchor";
import { ArborFAB } from "@/components/layout/ArborFAB";
import { cn } from "@/lib/cn";


// ─── Command Strip ───────────────────────────────────────────────

function CommandStrip() {
  const { auditCalibrationPercent } = useSovereignCommand();
  const pathname = usePathname();
  const router = useRouter();

  const conflictLabel =
    CONFLICT_COUNT === 1 ? "1 CONFLICT DETECTED" : `${CONFLICT_COUNT} CONFLICTS DETECTED`;

  function scrollToConflict() {
    if (pathname === "/you") {
      document
        .getElementById("resolution-center")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.dispatchEvent(new CustomEvent("arborix:highlight-resolution"));
    } else {
      router.push("/you#resolution-center");
    }
  }

  return (
    <div className="command-strip">
      <span className="command-strip-identity">
        {IDENTITY_ANCHOR.name.toUpperCase()} // AUDIT 01
      </span>

      <div className="command-strip-trust">
        <span className="command-strip-verified">{auditCalibrationPercent}% VERIFIED</span>
        <span>//</span>
        <span>MODERATE CONFIDENCE</span>
      </div>

      <div className="command-strip-health">
        <span
          className="command-strip-conflict"
          onClick={scrollToConflict}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && scrollToConflict()}
        >
          [!] {conflictLabel}
        </span>
        <span>//</span>
        <span>SYNCED: 4M AGO</span>
      </div>
    </div>
  );
}

// ─── AppShell ────────────────────────────────────────────────────

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isExternalView } = useExternalView();

  const isWelcome = pathname === "/welcome";

  return (
    <DiagnosticFocusProvider>
      <RightRailDrawerProvider>
        <div className="flex min-h-screen">
          <LeftNav />

          <main
            className={cn(
              "min-w-0 flex-1 bg-[var(--color-bg)] px-8",
              isWelcome
                ? "min-h-screen flex items-center justify-center pb-12"
                : "min-h-screen pt-16 pb-10",
              "ml-[var(--main-with-nav-ml)]",
            )}
          >
            <Suspense
              fallback={
                <div className={cn("w-full text-[var(--color-secondary)]", isWelcome ? "max-w-3xl" : "max-w-6xl")}>
                  Loading…
                </div>
              }
            >
              {isWelcome ? (
                <div className="w-full max-w-3xl">{children}</div>
              ) : (
                <>
                  <div className="w-full max-w-6xl">{children}</div>
                  {!isExternalView && <UtilityDock />}
                </>
              )}
            </Suspense>
          </main>
        </div>
        <RightRailDrawer />
        {/* Command Strip — hidden in external view and welcome */}
        {!isWelcome && !isExternalView && <CommandStrip />}
        {/* Arbor FAB */}
        {!isWelcome && !isExternalView && <ArborFAB />}
      </RightRailDrawerProvider>
    </DiagnosticFocusProvider>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ExternalViewProvider>
      <AppShellInner>{children}</AppShellInner>
    </ExternalViewProvider>
  );
}
