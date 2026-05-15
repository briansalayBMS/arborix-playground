"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./SideNav.module.css";

const NAV_LINKS = [
  { href: "/home", label: "HOME" },
  { href: "/you", label: "YOU" },
  { href: "/work", label: "WORK" },
  { href: "/company", label: "COMPANY" },
  { href: "/conversations", label: "PAST CONVERSATIONS" },
];

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={styles.nav}>
      {/* Wordmark */}
      <div className={styles.wordmark}>Arborix</div>

      {/* Nav links section */}
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

      {/* Spacer to push avatar to bottom */}
      <div className={styles.spacer} />

      {/* Avatar button */}
      <button
        className={`${styles.avatar} ${isActive("/settings") ? styles.active : ""}`}
        onClick={() => router.push("/settings")}
        aria-label="Settings"
      />
    </nav>
  );
}
