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
        style={{
          display: 'block',
          padding: '8px 0',
          fontSize: '14px',
          fontWeight: active ? 500 : 400,
          letterSpacing: '0.05em',
          color: active ? 'var(--color-primary)' : 'var(--color-secondary)',
          textTransform: 'uppercase',
          transition: 'color 0.15s ease, font-weight 0.15s ease',
        }}
        whileHover={{ color: 'var(--color-primary)' }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {label}
      </motion.span>
    </Link>
  );

  return (
    <aside style={{ position: 'fixed', top: 0, bottom: 0, left: '24px', width: '216px', display: 'flex', flexDirection: 'column', background: 'var(--color-background)', zIndex: 40 }}>
      {/* Logo — fixed at top, never scrolls */}
      <div style={{ padding: '24px 20px 0', flexShrink: 0 }}>
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

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 20px 0' }}>

        {/* HOME — root link */}
        <div style={{ marginTop: '24px', marginBottom: '36px' }}>
          {navLink("/home", "HOME", pathname === "/home")}
        </div>

        {/* Navigation groups */}
        <nav aria-label="Primary">
          <div>
            {NAV_GROUPS.map((group) => {
              const groupActive = domain === group.domain;
              return (
                <div key={group.domain} style={{ marginBottom: '36px' }}>
                  {/* Domain header */}
                  <span
                    style={{
                      display: 'block',
                      padding: '8px 0',
                      fontSize: '14px',
                      fontWeight: 400,
                      letterSpacing: '0.1em',
                      color: 'var(--color-secondary)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {group.domain}
                  </span>

                  {/* Items */}
                  <div style={{ position: 'relative', paddingLeft: '16px' }}>
                    {/* Left rail */}
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: 2,
                      bottom: 2,
                      width: '2px',
                      background: 'var(--color-border)',
                      borderRadius: '1px',
                    }} />
                    <ul className="list-none pl-0" style={{ margin: 0 }}>
                      {group.items.map((item) => {
                        const active = activeNavHref === item.href;
                        const isPendingYou = group.domain === "YOU" && item.href === "/you";
                        return (
                          <li key={`${group.domain}-${item.href}`} style={{ position: 'relative' }}>
                            {active && (
                              <span style={{
                                position: 'absolute',
                                left: '-16px',
                                top: 0,
                                bottom: 0,
                                width: '2px',
                                background: 'linear-gradient(180deg, var(--color-blue), var(--color-green))',
                                borderRadius: '1px',
                              }} />
                            )}
                            {navLink(item.href, item.label, active)}
                            {isPendingYou && (
                              <span style={{
                                position: 'absolute',
                                top: '8px',
                                right: 0,
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: 'var(--color-amber)',
                                flexShrink: 0,
                              }} aria-label="Pending conflict" />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Identity — pinned to bottom */}
      <div style={{
        padding: '16px 20px 56px',
        borderTop: '0.5px solid var(--color-border)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'var(--color-primary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 500, color: 'white', flexShrink: 0,
        }}>BS</div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)', lineHeight: 1.3 }}>Brian Salay</div>
          <div style={{ fontSize: '12px', fontWeight: 400, color: 'var(--color-secondary)', lineHeight: 1.3 }}>Senior Product Designer</div>
        </div>
      </div>
    </aside>
  );
}
