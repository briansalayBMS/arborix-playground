import Link from "next/link";
import styles from "./WhatsInPlay.module.css";

interface WhatsInPlayItem {
  id: string;
  label: string;
  onSelect?: () => void;
  href?: string;
}

interface WhatsInPlayProps {
  items: WhatsInPlayItem[];
}

export default function WhatsInPlay({ items }: WhatsInPlayProps) {
  return (
    <div className={styles.container}>
      <div className={styles.label}>What&apos;s in play</div>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            {item.href ? (
              <Link href={item.href} className={styles.button}>
                {item.label}
              </Link>
            ) : (
              <button
                onClick={item.onSelect}
                className={styles.button}
                type="button"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
