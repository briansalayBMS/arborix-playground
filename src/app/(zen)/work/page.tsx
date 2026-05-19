import Record from "@/components/record/Record";
import styles from "./page.module.css";

export default function WorkPage() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>WORK</h1>
      <Record domain="work" />
    </main>
  );
}
