"use client";

import UploadZone from "@/components/upload-zone/UploadZone";
import styles from "./WelcomeIntro.module.css";

interface WelcomeIntroProps {
  onUpload: (file: File) => void;
}

export default function WelcomeIntro({ onUpload }: WelcomeIntroProps) {
  return (
    <>
      <p className={styles.message}>
        Hi, I'm Arbor. I'm a coach built around your real work and growth — and the best place to
        start is your resume. Upload it and I'll take a look before we get into anything else.
      </p>
      <UploadZone onFileSelect={onUpload} />
      <p className={styles.footer}>Your file stays in your account.</p>
    </>
  );
}
