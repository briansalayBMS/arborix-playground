import Record from "@/components/record/Record";
import styles from "./page.module.css";

export default function CompanyPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>COMPANY</h1>
      <Record domain="company" />
    </main>
  );
}
