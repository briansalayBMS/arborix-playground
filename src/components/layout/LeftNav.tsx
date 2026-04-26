"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { IDENTITY_ANCHOR } from "@/constants/identityAnchor";
import { cn } from "@/lib/cn";

const NAV = [
  {
    domain: "YOU",
    domainHref: "/you" as const,
    items: [
      { href: "/you", label: "Overview" },
      { href: "/personality", label: "Personality" },
      { href: "/skills", label: "Skills" },
      { href: "/goals", label: "Goals" },
      { href: "/priorities", label: "Personal Priorities" },
    ],
  },
  {
    domain: "COMPANY",
    domainHref: "/company" as const,
    items: [
      { href: "/company", label: "Overview" },
      { href: "/company/context", label: "Context" },
      { href: "/company/goals", label: "Goals" },
      { href: "/company/team", label: "Team" },
      { href: "/company/manager", label: "Your Manager" },
    ],
  },
  {
    domain: "WORK",
    domainHref: "/work" as const,
    items: [
      { href: "/work", label: "Overview" },
      { href: "/okrs", label: "OKRs" },
      { href: "/projects", label: "Active Projects" },
      { href: "/week", label: "Your Week" },
      { href: "/performance", label: "My Performance" },
    ],
  },
] as const;

function findActiveHref(pathname: string): string | null {
  let best: string | null = null;
  for (const section of NAV) {
    for (const item of section.items) {
      const exact = pathname === item.href;
      const nested = pathname.startsWith(`${item.href}/`);
      if (exact || nested) {
        if (!best || item.href.length > best.length) best = item.href;
      }
    }
  }
  return best;
}

function activeDomain(pathname: string): "YOU" | "COMPANY" | "WORK" | null {
  if (
    pathname === "/welcome" ||
    pathname === "/home" ||
    pathname.startsWith("/ingest")
  ) {
    return null;
  }
  if (
    pathname === "/" ||
    pathname.startsWith("/you") ||
    pathname.startsWith("/personality") ||
    pathname.startsWith("/skills") ||
    pathname.startsWith("/goals") ||
    pathname.startsWith("/priorities")
  ) {
    return "YOU";
  }
  if (pathname.startsWith("/company")) return "COMPANY";
  if (
    pathname.startsWith("/okrs") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/week") ||
    pathname.startsWith("/performance") ||
    pathname.startsWith("/work")
  ) {
    return "WORK";
  }
  return null;
}

const IDENTITY_LONG_PRESS_MS = 850;

export function LeftNav({
  locked = false,
  welcomeLock = false,
}: {
  locked?: boolean;
  welcomeLock?: boolean;
}) {
  const pathname = usePathname();
  const { toggleSimulation } = useDemoFirstTime();
  const identityLongPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const identityLongPressConsumed = useRef(false);
  const domain = activeDomain(pathname);
  const activeNavHref = findActiveHref(pathname);

  const clearIdentityLongPress = () => {
    if (identityLongPressTimer.current) {
      clearTimeout(identityLongPressTimer.current);
      identityLongPressTimer.current = null;
    }
  };

  return (
    <aside
      className={cn(
        "fixed top-0 bottom-0 left-[var(--nav-gutter)] z-40 flex w-[var(--nav-w)] flex-col border-r border-[var(--color-arborix-line)] bg-[var(--color-arborix-bg)] transition-opacity duration-300",
        locked &&
          cn(
            "pointer-events-none select-none",
            welcomeLock ? "opacity-40" : "opacity-30",
          ),
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-10">
        <div className="mb-14 flex shrink-0 justify-start">
          <Link
            href="/home"
            className="block"
            tabIndex={locked ? -1 : undefined}
            aria-disabled={locked || undefined}
            onClick={locked ? (e) => e.preventDefault() : undefined}
          >
            <motion.div
              tabIndex={-1}
              whileHover={locked ? undefined : { scale: 1.01 }}
              whileTap={locked ? undefined : { scale: 0.99 }}
              transition={{ type: "spring", stiffness: 520, damping: 34 }}
              className="inline-block"
            >
              <Image
                src="/arborix-logo.png"
                alt="Arborix"
                width={40}
                height={48}
                priority
                className="h-12 w-auto"
              />
            </motion.div>
          </Link>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Primary">
          <div className="min-w-0 flex-1 space-y-12 pl-0">
            {NAV.map((section) => {
              const domainKey = section.domain as "YOU" | "COMPANY" | "WORK";
              const domainActive = domain !== null && domain === domainKey;
              return (
                <div key={section.domain}>
                  <h2 className="m-0 p-0">
                    <Link
                      href={section.domainHref}
                      className={cn(
                        "block outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-arborix-accent)]/40",
                        locked && "pointer-events-none",
                      )}
                      tabIndex={locked ? -1 : undefined}
                      aria-disabled={locked || undefined}
                      onClick={locked ? (e) => e.preventDefault() : undefined}
                    >
                      <span
                        className={cn(
                          "font-code text-[12px] uppercase tracking-[0.22em]",
                          locked
                            ? "font-normal text-[var(--color-arborix-meta)]"
                            : domainActive
                              ? "font-bold text-[var(--color-arborix-text)]"
                              : "font-normal text-[var(--color-arborix-meta)] hover:text-[var(--color-arborix-text)]",
                        )}
                      >
                        {section.domain}
                      </span>
                    </Link>
                  </h2>
                  <ul className="mt-4 list-none space-y-0.5 pl-0">
                    {section.items.map((item) => {
                      const active = activeNavHref === item.href;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={cn("block outline-none", locked && "pointer-events-none")}
                            tabIndex={locked ? -1 : undefined}
                            aria-disabled={locked || undefined}
                            onClick={locked ? (e) => e.preventDefault() : undefined}
                          >
                            <motion.span
                              tabIndex={-1}
                              className={cn(
                                "font-code text-[12px] uppercase tracking-[0.15em]",
                                "block py-2.5 transition-[color,opacity,font-weight]",
                                locked
                                  ? "font-medium text-[var(--color-arborix-meta)]"
                                  : active
                                    ? "font-bold text-[var(--color-arborix-text)]"
                                    : "font-normal text-[var(--color-arborix-meta)] hover:text-[var(--color-arborix-text)]",
                              )}
                              whileTap={locked ? undefined : { scale: 0.98 }}
                              transition={{ type: "spring", stiffness: 420, damping: 28 }}
                            >
                              {item.label}
                            </motion.span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        <div className="mt-auto shrink-0 border-t border-[var(--color-arborix-line)] pt-5">
          <Link
            href="/ingest"
            className={cn("block outline-none", locked && "pointer-events-none")}
            tabIndex={locked ? -1 : undefined}
            aria-disabled={locked || undefined}
            onClick={locked ? (e) => e.preventDefault() : undefined}
          >
            <motion.span
              tabIndex={-1}
              className={cn(
                "font-code block py-2 text-[12px] uppercase tracking-[0.15em] transition-[color,font-weight]",
                locked
                  ? "font-bold text-[var(--color-arborix-meta)]"
                  : pathname.startsWith("/ingest")
                    ? "font-bold text-[var(--color-arborix-text)]"
                    : "font-normal text-[var(--color-arborix-meta)] hover:text-[var(--color-arborix-text)]",
              )}
              whileTap={locked ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
            >
              INGESTION LOG
            </motion.span>
          </Link>
        </div>
      </div>

      <Link
        href={IDENTITY_ANCHOR.href}
        className={cn(
          "group shrink-0 border-t-[0.5px] border-[#E2E8F0] bg-[var(--color-arborix-bg)] p-4 text-left outline-none transition-colors",
          "hover:bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#06B6D4]/40",
          locked && "pointer-events-none opacity-60",
        )}
        tabIndex={locked ? -1 : undefined}
        aria-label="Account and settings"
        onPointerDown={
          locked
            ? undefined
            : () => {
                identityLongPressConsumed.current = false;
                clearIdentityLongPress();
                identityLongPressTimer.current = setTimeout(() => {
                  identityLongPressConsumed.current = true;
                  toggleSimulation();
                }, IDENTITY_LONG_PRESS_MS);
              }
        }
        onPointerUp={
          locked
            ? undefined
            : () => {
                clearIdentityLongPress();
              }
        }
        onPointerLeave={
          locked
            ? undefined
            : () => {
                clearIdentityLongPress();
              }
        }
        onClick={
          locked
            ? (e) => e.preventDefault()
            : (e) => {
                if (identityLongPressConsumed.current) {
                  e.preventDefault();
                  identityLongPressConsumed.current = false;
                }
              }
        }
      >
        <div className="flex items-start gap-3 text-left">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#131517] font-code text-[12px] font-medium text-white"
            aria-hidden
          >
            {IDENTITY_ANCHOR.initials}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="m-0 font-ui text-[14px] font-semibold leading-tight text-[#131517]">
              {IDENTITY_ANCHOR.name}
            </p>
          </div>
        </div>
      </Link>
    </aside>
  );
}
