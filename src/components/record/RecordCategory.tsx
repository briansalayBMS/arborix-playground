"use client";

import { useRightPane } from "@/context/RightPaneContext";
import type { LedgerItem } from "@/lib/api/types";
import RecordRow from "./RecordRow";
import styles from "./RecordCategory.module.css";

interface RecordCategoryProps {
  label: string;
  items: LedgerItem[];
  emptyCopy?: string;
  chatSubject?: string;
}

export default function RecordCategory({
  label,
  items,
  emptyCopy,
  chatSubject,
}: RecordCategoryProps) {
  const { openWithContext } = useRightPane();
  const count = items.length;

  const handleEmptyClick = () => {
    if (!emptyCopy) return;
    openWithContext({
      type: "chat",
      subject: chatSubject ?? label.toLowerCase(),
      placeholder: emptyCopy,
      detail: { body: emptyCopy },
    });
  };

  return (
    <section className={styles.category}>
      <header className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.count}>({count})</span>
      </header>
      {count === 0 ? (
        emptyCopy ? (
          <button
            type="button"
            className={styles.emptyCopy}
            onClick={handleEmptyClick}
          >
            {emptyCopy}
          </button>
        ) : null
      ) : (
        <div className={styles.rows}>
          {items.map((item) => (
            <RecordRow key={item.id} item={item} categoryLabel={label} />
          ))}
        </div>
      )}
    </section>
  );
}
