import AuthTopBar from "@/components/auth-top-bar/AuthTopBar";
import styles from "./WelcomeShell.module.css";

interface WelcomeShellProps {
  children: React.ReactNode;
}

export default function WelcomeShell({ children }: WelcomeShellProps) {
  return (
    <>
      <AuthTopBar />
      <main className={styles.main}>
        {children}
      </main>
    </>
  );
}
