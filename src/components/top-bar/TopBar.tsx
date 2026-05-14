import styles from "./TopBar.module.css";

export default function TopBar() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Arborix</div>
      <div className={styles.avatar}></div>
    </header>
  );
}
