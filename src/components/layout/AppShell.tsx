"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { DiagnosticFocusProvider } from "@/context/DiagnosticFocusContext";
import { RightRailDrawerProvider } from "@/context/RightRailDrawerContext";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import { LeftNav } from "@/components/layout/LeftNav";
import { RightRailDrawer } from "@/components/sovereign/RightRailDrawer";
import { cn } from "@/lib/cn";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { personalityPhase1Complete } = useSovereignCommand();
  const isWelcome = pathname === "/welcome";
  const isYouHub = pathname === "/you";
  const youNavLocked = isYouHub && !personalityPhase1Complete;
  const navLocked = isWelcome || youNavLocked;
  const welcomeLock = isWelcome || youNavLocked;

  return (
    <DiagnosticFocusProvider>
      <RightRailDrawerProvider>
        <div className="flex min-h-screen">
          <LeftNav locked={navLocked} welcomeLock={welcomeLock} />
          <main
            className={cn(
              "min-h-screen min-w-0 flex-1 bg-white px-8 py-12",
              "ml-[var(--main-with-nav-ml)]",
              isWelcome && "flex items-center justify-center",
            )}
          >
            <Suspense
              fallback={
                <div
                  className={cn(
                    "w-full text-[var(--color-arborix-meta)]",
                    isWelcome ? "max-w-3xl" : "max-w-6xl",
                  )}
                >
                  Loading…
                </div>
              }
            >
              {isWelcome ? (
                <div className="w-full max-w-3xl">{children}</div>
              ) : (
                <div className="w-full max-w-6xl">{children}</div>
              )}
            </Suspense>
          </main>
        </div>
        <RightRailDrawer />
      </RightRailDrawerProvider>
    </DiagnosticFocusProvider>
  );
}
