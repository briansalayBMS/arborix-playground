import styles from "./ArborMessage.module.css";

interface ArborMessageProps {
  children: React.ReactNode;
  accent?: string;
}

const frauncesTuning = {
  fontVariationSettings: '"opsz" 22, "wght" 350, "SOFT" 50, "WONK" 0',
} as const;

export default function ArborMessage({ children, accent }: ArborMessageProps) {
  if (!accent || typeof children !== "string") {
    return <p className={styles.message} style={frauncesTuning}>{children}</p>;
  }

  const text = children;
  const index = text.indexOf(accent);

  if (index === -1) {
    return <p className={styles.message} style={frauncesTuning}>{children}</p>;
  }

  return (
    <p className={styles.message} style={frauncesTuning}>
      {text.substring(0, index)}
      <span className={styles.accent}>{accent}</span>
      {text.substring(index + accent.length)}
    </p>
  );
}
