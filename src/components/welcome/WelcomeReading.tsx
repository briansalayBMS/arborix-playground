import ArborSpeech from "@/components/arbor-speech/ArborSpeech";
import styles from "./WelcomeReading.module.css";

export default function WelcomeReading() {
  return (
    <div className={styles.wrapper}>
      <ArborSpeech>Reading your career...</ArborSpeech>
    </div>
  );
}
