"use client";

import { useEffect, useState } from "react";
import styles from "./ShareDialog.module.css";

interface ShareDialogProps {
  open: boolean;
  link: string;
  generatedDate: string;
  onClose: () => void;
}

export default function ShareDialog({
  open,
  link,
  generatedDate,
  onClose,
}: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden />
      <div
        className={styles.popover}
        role="dialog"
        aria-label="Sovereign share link"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>SOVEREIGN SHARE LINK</div>
        <div className={styles.row}>
          <input
            readOnly
            value={link}
            className={styles.input}
            aria-label="Share link"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={styles.copyButton}
          >
            {copied ? "COPIED" : "COPY"}
          </button>
        </div>
        <div className={styles.footer}>Generated {generatedDate} · View only</div>
      </div>
    </>
  );
}
