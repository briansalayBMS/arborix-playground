"use client";

import { ArrowRight, Link2 } from "lucide-react";
import { useChatBar } from "@/context/ChatBarContext";
import styles from "./HeroVerdict.module.css";

interface Source {
  id: string;
  type: string;
  title: string;
  excerpt: string;
}

interface HeroVerdictProps {
  title: string;
  body: string;
  sources: Source[];
}

export default function HeroVerdict({ title, body, sources }: HeroVerdictProps) {
  const { openWithContext } = useChatBar();

  const handleChainlinkClick = () => {
    openWithContext({
      type: "sources",
      sources,
      placeholder: "These sources shaped this read.",
    });
  };

  const handleTalkAboutThis = () => {
    openWithContext({
      type: "chat",
      subject: "the hero synthesis",
      placeholder: "What part do you want to push on?",
      detail: {
        body: "What part do you want to push on?",
      },
    });
  };

  const bodyWords = body.trim().split(/\s+/);
  const lastWord = bodyWords[bodyWords.length - 1];
  const beforeLastWord = bodyWords.slice(0, -1).join(" ");

  return (
    <header className={styles.hero}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.body}>
        {beforeLastWord && `${beforeLastWord} `}
        <span className={styles.nowrap}>
          {lastWord}
          <button
            type="button"
            className={styles.chainlinkButton}
            onClick={handleChainlinkClick}
            aria-label="View sources behind this read"
          >
            <Link2 size={14} strokeWidth={1.5} />
          </button>
        </span>
      </p>
      <button
        type="button"
        className={styles.talkAction}
        onClick={handleTalkAboutThis}
      >
        <span className={styles.nowrapAction}>
          Talk about this
          <ArrowRight size={16} strokeWidth={1.5} className={styles.actionArrow} />
        </span>
      </button>
    </header>
  );
}
