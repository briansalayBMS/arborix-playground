"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import SovereignBeacon from "@/components/sovereign-beacon/SovereignBeacon";
import styles from "./HomeWelcome.module.css";

const EMOJI_OPTIONS = ["😀", "😐", "😔"];

export default function HomeWelcome() {
  const [moodOpen, setMoodOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setMoodOpen(false);
  };

  const handleContinuityClick = () => {
    // TODO: Wire this to open the right pane pre-loaded on the continuity subject
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

      <button
        className={styles.attribution}
        type="button"
        // TODO: Wire to open evidence details
      >
        From our last 3 conversations
      </button>
    </div>
  );
}
