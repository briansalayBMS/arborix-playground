"use client";

import { useEffect, useRef, useState } from "react";
import ArborSpeech from "@/components/arbor-speech/ArborSpeech";
import styles from "./RightPane.module.css";

interface RightPaneProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RightPane({ isOpen, onClose }: RightPaneProps) {
  const [message, setMessage] = useState("");
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        paneRef.current &&
        !paneRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div
      ref={paneRef}
      className={`${styles.pane} ${isOpen ? styles.open : ""}`}
    >
      <div className={styles.header}>
        <span className={styles.label}>Arbor</span>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close Arbor"
        >
          ✕
        </button>
      </div>

      <div className={styles.conversationArea}>
        <ArborSpeech>
          Hi Brian. We were talking about the staff hire last time. Want to
          pick that up, or start somewhere new?
        </ArborSpeech>
      </div>

      <div className={styles.inputArea}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textarea}
          placeholder="type a message"
        />
        <button
          className={styles.sendButton}
          onClick={handleSend}
          disabled={!message.trim()}
        >
          Send →
        </button>
      </div>
    </div>
  );
}
