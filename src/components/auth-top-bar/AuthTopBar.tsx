"use client";

import styles from "./AuthTopBar.module.css";

export default function AuthTopBar() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Arborix</div>
    </header>
  );
}
