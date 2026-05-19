"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ArrowRight, Link2 } from "lucide-react";
import SovereignBeacon from "@/components/sovereign-beacon/SovereignBeacon";
import { useRightPane } from "@/context/RightPaneContext";
import type { Source } from "@/components/right-pane/RightPane";
import styles from "./HomeWelcome.module.css";

const EMOJI_OPTIONS = ["😀", "😐", "😔"];

const WELCOME_SOURCES: Source[] = [
  {
    id: "session_recent_1",
    type: "session",
    title: "Session 5 · 2026-05-17",
    excerpt:
      "Walked through the loop with the TechCorp recruiter — Brian's read on the second-round question.",
  },
  {
    id: "session_recent_2",
    type: "session",
    title: "Session 4 · 2026-05-15",
    excerpt:
      "How Brian's framing of the Director-level scope shows up to a hiring panel that hasn't met him.",
  },
  {
    id: "session_recent_3",
    type: "session",
    title: "Session 3 · 2026-05-11",
    excerpt:
      "What Brian wants the next interview to surface that the last two didn't.",
  },
];

export default function HomeWelcome() {
  const [moodOpen, setMoodOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const { openWithContext } = useRightPane();
  const greetingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        greetingRef.current &&
        !greetingRef.current.contains(event.target as Node)
      ) {
        setMoodOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
    setMoodOpen(false);
  };

  const handleContinuityClick = () => {
    openWithContext({
      type: "continuity",
      subject: "interviews",
      placeholder:
        "Continuity from your most recent conversation about interviews will load here once chat is wired.",
    });
  };

  const handleAttributionClick = () => {
    openWithContext({
      type: "sources",
      sources: WELCOME_SOURCES,
      sourceNoun: "conversation",
      placeholder: "These conversations shaped this read.",
    });
  };

  return (
    <div className={styles.welcome}>
      <div className={styles.beacon}>
        <SovereignBeacon />
      </div>

      {/* Greeting block — 20px italic */}
      <div className={styles.greetingBlock} ref={greetingRef}>
        <span className={styles.greeting}>Hi Brian.</span>
        {" "}
        <span className={styles.moodContainer}>
          <button
            className={styles.moodQuestion}
            onClick={() => setMoodOpen(!moodOpen)}
            aria-expanded={moodOpen}
            type="button"
          >
            How are you feeling?
            {selectedEmoji && (
              <span className={styles.selectedMood}>{selectedEmoji}</span>
            )}
            <ChevronDown
              size={14}
              strokeWidth={1.5}
              className={styles.moodChevron}
            />
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
      </div>

      {/* Primary block — 32px italic */}
      <p className={styles.primaryBlock}>
        We&apos;ve been talking about your interviews{" "}
        <span className={styles.nowrap}>
          lately.
          <button
            type="button"
            className={styles.chainlinkButton}
            onClick={handleAttributionClick}
            aria-label="View the conversations behind this read"
          >
            <Link2 size={14} strokeWidth={1.5} />
          </button>
        </span>{" "}
        <a
          href="#"
          className={styles.invitation}
          onClick={(e) => {
            e.preventDefault();
            handleContinuityClick();
          }}
        >
          Want to pick that{" "}
          <span className={styles.nowrapAction}>
            back up?
            <ArrowRight
              size={20}
              strokeWidth={1.5}
              className={styles.arrowIcon}
            />
          </span>
        </a>
      </p>
    </div>
  );
}
