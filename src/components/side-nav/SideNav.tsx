"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { IDENTITY_ANCHOR } from "@/constants/identityAnchor";
import styles from "./SideNav.module.css";

const NAV_LINKS = [
  { href: "/home", label: "HOME" },
  { href: "/you", label: "YOU" },
  { href: "/work", label: "WORK" },
  { href: "/company", label: "COMPANY" },
  { href: "/conversations", label: "PAST CONVERSATIONS" },
];

function computeInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === "") return IDENTITY_ANCHOR.initials;
  const first = parts[0][0] ?? "";
  const second = parts.length > 1 ? (parts[1][0] ?? "") : "";
  const result = `${first}${second}`.toUpperCase();
  return result || IDENTITY_ANCHOR.initials;
}

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const displayName = user?.name?.trim() || IDENTITY_ANCHOR.name;
  const initials = computeInitials(displayName);

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={styles.nav}>
      <div className={styles.wordmark}>Arborix</div>

      <div className={styles.linksSection}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.navLink} ${isActive(link.href) ? styles.active : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className={styles.spacer} />

      <button
        className={`${styles.identityRow} ${isActive("/settings") ? styles.active : ""}`}
        onClick={() => router.push("/settings")}
        aria-label="Settings"
      >
        <span className={styles.avatar}>{initials}</span>
        <span className={styles.name}>{displayName}</span>
      </button>
    </nav>
  );
}
