"use client";

import { useEffect } from "react";
import styles from "./PlaceholderDialog.module.css";

interface PlaceholderDialogProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function PlaceholderDialog({
  open,
  title,
  message,
  onClose,
}: PlaceholderDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>{title}</div>
        <p className={styles.message}>{message}</p>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
