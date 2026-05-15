"use client";

import UploadZone from "@/components/upload-zone/UploadZone";
import ArborSpeech from "@/components/arbor-speech/ArborSpeech";
import styles from "./WelcomeIntro.module.css";

interface WelcomeIntroProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onContinue: () => void;
}

export default function WelcomeIntro({ selectedFile, onFileSelect, onContinue }: WelcomeIntroProps) {
  return (
    <>
      <ArborSpeech>
        Hi, I&apos;m Arbor. I&apos;m a coach built around your real work and growth — and the best place to
        start is your resume. Upload it and I&apos;ll take a look before we get into anything else.
      </ArborSpeech>

      <UploadZone onFileSelect={onFileSelect} selectedFile={selectedFile} />

      <button
        className={styles.button}
        onClick={onContinue}
        disabled={!selectedFile}
      >
        Send to Arbor →
      </button>
    </>
  );
}
