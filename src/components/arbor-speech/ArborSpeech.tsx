import SovereignBeacon from "@/components/sovereign-beacon/SovereignBeacon";
import ArborMessage from "@/components/arbor-message/ArborMessage";
import styles from "./ArborSpeech.module.css";

interface ArborSpeechProps {
  children: React.ReactNode;
  accent?: string;
}

export default function ArborSpeech({ children, accent }: ArborSpeechProps) {
  return (
    <div className={styles.speech}>
      <SovereignBeacon />
      <ArborMessage accent={accent}>{children}</ArborMessage>
    </div>
  );
}
