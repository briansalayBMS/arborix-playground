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

function CommandStrip({ viewMode = "internal" }: { viewMode?: "internal" | "external" }) {
  const { auditCalibrationPercent } = useSovereignCommand();
  const pathname = usePathname();
  const router = useRouter();

  const conflictLabel =
    CONFLICT_COUNT === 1 ? "1 WORTH A CLOSER LOOK" : `${CONFLICT_COUNT} CLOSER LOOK`;

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
    <div style={viewMode === "external" ? { visibility: "hidden", pointerEvents: "none" } : {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40px',
      background: '#1D1D1F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      zIndex: 50,
      fontFamily: 'var(--font-mono)',
      fontSize: '13px',
      letterSpacing: '0.03em',
    }}>
      <span className="arb-command-strip__zone arb-command-strip__name">
        {IDENTITY_ANCHOR.name.toUpperCase()} // SESSION 01
      </span>

      <div className="arb-command-strip__zone">
        <span className="arb-command-strip__verified">{auditCalibrationPercent}% VERIFIED</span>
        <span>//</span>
        <span>MODERATE CONFIDENCE</span>
      </div>

      <div className="arb-command-strip__zone">
        <span
          className="arb-command-strip__conflict"
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

          <main style={{
              marginLeft: '264px',
              minHeight: '100vh',
              background: '#F5F5F3',
              padding: '48px 96px calc(40px + 72px) 96px',
              paddingLeft: '96px',
              maxWidth: 'calc(1440px - 240px)',
              overflowX: 'hidden',
            }}>
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
                  {children}
                  {!isExternalView && <UtilityDock />}
                </>
              )}
            </Suspense>
          </main>
        </div>
        <RightRailDrawer />
        {/* Command Strip — visibility toggled via viewMode; not unmounted */}
        {!isWelcome && <CommandStrip viewMode={isExternalView ? "external" : "internal"} />}
        {/* Arbor FAB — visibility toggled via viewMode; not unmounted */}
        {!isWelcome && <ArborFAB viewMode={isExternalView ? "external" : "internal"} />}
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
