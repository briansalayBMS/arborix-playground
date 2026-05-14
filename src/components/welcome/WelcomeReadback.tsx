"use client";

import { useState } from "react";
import Link from "next/link";
import ArborSpeech from "@/components/arbor-speech/ArborSpeech";
import styles from "./WelcomeReadback.module.css";

interface WelcomeReadbackProps {
  readback: string;
  onSubmit: (answer: string) => void;
}

export default function WelcomeReadback({ readback, onSubmit }: WelcomeReadbackProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answer);
  };

  return (
    <>
      <ArborSpeech>{readback}</ArborSpeech>

      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="type a few sentences"
          className={styles.textarea}
        />

        <div className={styles.buttonContainer}>
          <button type="submit" className={styles.submitButton}>
            Send →
          </button>
        </div>
      </form>

      <div className={styles.footerLink}>
        <Link href="/home">Take me to my dashboard →</Link>
      </div>
    </>
  );
}
