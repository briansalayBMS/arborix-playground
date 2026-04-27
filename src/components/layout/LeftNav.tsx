"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { IDENTITY_ANCHOR } from "@/constants/identityAnchor";
import { cn } from "@/lib/cn";

// ─── Navigation structure ────────────────────────────────────────

const NAV_GROUPS = [
  {
    domain: "YOU",
    items: [
      { href: "/you",         label: "Dossier" },
      { href: "/personality", label: "Traits" },
      { href: "/priorities",  label: "Priorities" },
    ],
  },
  {
    domain: "WORK",
    items: [
      { href: "/work",     label: "Impact Cards" },
      { href: "/projects", label: "Projects" },
      { href: "/ingest",   label: "Artifacts" },
    ],
  },
  {
    domain: "COMPANY",
    items: [
      { href: "/week",             label: "Weekly Update" },
      { href: "/company/team",     label: "Team" },
      { href: "/company/manager",  label: "Manager" },
    ],
  },
  {
    domain: "THE LAB",
    items: [
      { href: "/ingest",  label: "Raw Logs" },
      { href: "/account", label: "Sync Settings" },
    ],
  },
] as const;

// ─── Active detection ────────────────────────────────────────────

function activeDomain(pathname: string): string | null {
  if (pathname === "/welcome" || pathname === "/home") return null;
  if (pathname === "/you" || pathname.startsWith("/personality") || pathname.startsWith("/priorities")) return "YOU";
  if (pathname.startsWith("/work") || pathname.startsWith("/projects")) return "WORK";
  if (pathname.startsWith("/ingest")) return "WORK";
  if (pathname.startsWith("/week") || pathname.startsWith("/company")) return "COMPANY";
  if (pathname.startsWith("/account")) return "THE LAB";
  return null;
}

function findActiveHref(pathname: string): string | null {
  let best: string | null = null;
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      const exact = pathname === item.href;
      const nested = item.href !== "/ingest" && pathname.startsWith(`${item.href}/`);
      if (exact || nested) {
        if (!best || item.href.length > best.length) best = item.href;
      }
    }
  }
  return best;
}

// ─── Component ───────────────────────────────────────────────────

const IDENTITY_LONG_PRESS_MS = 850;

export function LeftNav() {
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

  const navLink = (href: string, label: React.ReactNode, active: boolean) => (
    <Link href={href} className="block outline-none">
      <motion.span
        tabIndex={-1}
        className={cn(
          "font-ui text-[12px] uppercase tracking-[0.15em]",
          "block py-2.5 transition-[color,font-weight]",
          active
            ? "font-bold text-[var(--color-primary)]"
            : "font-normal text-[var(--color-secondary)] hover:text-[var(--color-primary)]",
        )}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {label}
      </motion.span>
    </Link>
  );

  return (
    <aside className="fixed top-0 bottom-0 left-[var(--nav-gutter)] z-40 flex w-[var(--nav-w)] flex-col bg-transparent">
      <div className="flex min-h-0 flex-1 flex-col px-4 pb-6 pt-10">

        {/* Logo */}
        <div className="mb-8 flex shrink-0 justify-start">
          <Link href="/home" className="block">
            <motion.div
              tabIndex={-1}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
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

        {/* HOME — root link */}
        <div className="mb-8">
          {navLink("/home", "HOME", pathname === "/home")}
        </div>

        {/* Navigation groups */}
        <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto" aria-label="Primary">
          <div className="min-w-0 flex-1 space-y-10">
            {NAV_GROUPS.map((group) => {
              const groupActive = domain === group.domain;
              return (
                <div key={group.domain}>
                  {/* Domain header */}
                  <span
                    className={cn(
                      "font-ui text-[12px] uppercase tracking-[0.22em] mb-3 block",
                      groupActive
                        ? "font-bold text-[var(--color-primary)]"
                        : "font-normal text-[var(--color-secondary)]",
                    )}
                  >
                    {group.domain}
                  </span>

                  {/* Items */}
                  <ul className="list-none space-y-0.5 pl-0">
                    {group.items.map((item) => {
                      const active = activeNavHref === item.href;
                      const isPendingYou = group.domain === "YOU" && item.href === "/you";
                      return (
                        <li key={`${group.domain}-${item.href}`} className="relative">
                          {navLink(item.href, item.label, active)}
                          {/* Amber dot — pending conflict indicator on Dossier */}
                          {isPendingYou ? (
                            <span
                              aria-label="Pending conflict"
                              style={{
                                position: "absolute",
                                top: "50%",
                                right: 0,
                                transform: "translateY(-50%)",
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                backgroundColor: "var(--color-amber)",
                              }}
                            />
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Identity anchor */}
      <Link
        href={IDENTITY_ANCHOR.href}
        className={cn(
          "group shrink-0 border-t-[0.5px] border-[var(--color-border)] bg-transparent px-4 pt-4 text-left outline-none transition-colors",
          "hover:bg-[rgba(0,0,0,0.04)] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--color-blue)]/40",
        )}
        style={{ paddingBottom: "calc(var(--command-strip-height, 40px) + var(--spacing-6x))" }}
        aria-label="Account and settings"
        onPointerDown={() => {
          identityLongPressConsumed.current = false;
          clearIdentityLongPress();
          identityLongPressTimer.current = setTimeout(() => {
            identityLongPressConsumed.current = true;
            toggleSimulation();
          }, IDENTITY_LONG_PRESS_MS);
        }}
        onPointerUp={() => { clearIdentityLongPress(); }}
        onPointerLeave={() => { clearIdentityLongPress(); }}
        onClick={(e) => {
          if (identityLongPressConsumed.current) {
            e.preventDefault();
            identityLongPressConsumed.current = false;
          }
        }}
      >
        <div className="flex items-start gap-3 text-left">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] font-ui text-[12px] font-medium text-white"
            aria-hidden
          >
            {IDENTITY_ANCHOR.initials}
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p
              className="m-0 text-[14px] font-semibold leading-tight text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {IDENTITY_ANCHOR.name}
            </p>
          </div>
        </div>
      </Link>
    </aside>
  );
}
