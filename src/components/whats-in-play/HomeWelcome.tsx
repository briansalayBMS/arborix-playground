"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import SovereignBeacon from "@/components/sovereign-beacon/SovereignBeacon";
import { useRightPane } from "@/context/RightPaneContext";
import styles from "./HomeWelcome.module.css";

const EMOJI_OPTIONS = ["😀", "😐", "😔"];

export default function HomeWelcome() {
  const [moodOpen, setMoodOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const { openWithContext } = useRightPane();

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setMoodOpen(false);
  };

  const handleContinuityClick = () => {
    openWithContext({
      type: "continuity",
      subject: "interviews",
      placeholder: "Continuity from your most recent conversation about interviews will load here once chat is wired."
    });
  };

  return (
    <div className={styles.welcome}>
      <div className={styles.beacon}>
        <SovereignBeacon />
      </div>

      <p className={styles.paragraph}>
        Hi Brian. How are you walking in today
        <span className={styles.moodContainer}>
          <button
            className={styles.moodToggle}
            onClick={() => setMoodOpen(!moodOpen)}
            type="button"
          >
            {selectedEmoji || (
              <span className={styles.chevron}>
                <ChevronDown size={14} strokeWidth={1.5} />
              </span>
            )}
          </button>

          {moodOpen && (
            <div className={styles.moodDropdown}>
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  className={styles.moodOption}
                  onClick={() => handleEmojiSelect(emoji)}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </span>
        ? We&apos;ve been talking about your interviews lately.{" "}
        <a
          href="#"
          className={styles.primaryInvitation}
          onClick={(e) => {
            e.preventDefault();
            handleContinuityClick();
          }}
        >
          Want to pick that{" "}
          <span className={styles.nowrapAction}>
            back up?
            <ArrowRight size={20} strokeWidth={1.5} className={styles.arrowIcon} />
          </span>
        </a>
      </p>

      <Link href="/conversations" className={styles.attribution}>
        From our last 3 conversations
      </Link>
    </div>
  );
}
