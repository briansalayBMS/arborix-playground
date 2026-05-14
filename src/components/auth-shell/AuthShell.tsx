import SovereignBeacon from "@/components/sovereign-beacon/SovereignBeacon";
import styles from "./AuthShell.module.css";

interface AuthShellProps {
  heading: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function AuthShell({ heading, children, footer }: AuthShellProps) {
  return (
    <main className={styles.main}>
      <div className={styles.beacon}>
        <SovereignBeacon />
      </div>

      <h1 className={styles.heading}>{heading}</h1>

      <div className={styles.form}>{children}</div>

      {footer && <div className={styles.footer}>{footer}</div>}
    </main>
  );
}
