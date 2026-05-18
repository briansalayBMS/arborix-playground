"use client";

import { useEffect, useRef, useState } from "react";
import ArborSpeech from "@/components/arbor-speech/ArborSpeech";
import styles from "./RightPane.module.css";

export type Source = {
  id: string;
  type: "document" | "session" | "synthesis";
  title: string;
  excerpt?: string;
  reference?: string;
};

export type POVType = "observation" | "conflict" | "partial-read";

export interface RightPaneDetail {
  title?: string;
  subtitle?: string;
  body?: string;
  linkedItems?: { id: string; label: string }[];
}

export interface RightPaneContext {
  type:
    | "evidence"
    | "chat"
    | "conversationSummary"
    | "continuity"
    | "goal"
    | "sources"
    | "goalDetail"
    | "impactDetail"
    | "operatingProfileDetail"
    | "skillDetail"
    | "radarDetail";
  subject?: string;
  povId?: string;
  povType?: POVType;
  sources?: Source[];
  detail?: RightPaneDetail;
  placeholder: string;
}

const NUMBER_WORDS: Record<number, string> = {
  1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
};

function sourcesOpeningLine(count: number): string {
  if (count === 1) return "This source shaped my read.";
  const word = NUMBER_WORDS[count] ?? String(count);
  return `These ${word} sources shaped my read.`;
}

interface DetailViewProps {
  monoLabel?: string;
  heading?: string;
  headingSize?: "title" | "display";
  subtitle?: string;
  body?: string;
  linkedItemsHeader?: string;
  linkedItems?: { id: string; label: string }[];
  sources?: Source[];
}

function DetailView({
  monoLabel,
  heading,
  headingSize = "title",
  subtitle,
  body,
  linkedItemsHeader,
  linkedItems,
  sources,
}: DetailViewProps) {
  return (
    <div className={styles.detailView}>
      <div className={styles.detailHead}>
        {monoLabel && <div className={styles.detailMonoLabel}>{monoLabel}</div>}
        {heading && (
          <h3
            className={
              headingSize === "display"
                ? styles.detailHeadingDisplay
                : styles.detailHeading
            }
          >
            {heading}
          </h3>
        )}
        {subtitle && <div className={styles.detailSubtitle}>{subtitle}</div>}
      </div>
      {body && <ArborSpeech>{body}</ArborSpeech>}
      {linkedItems && linkedItems.length > 0 && (
        <div className={styles.detailSection}>
          <div className={styles.detailSectionHeader}>
            {linkedItemsHeader ?? "Linked"}
          </div>
          <ul className={styles.detailLinkedList}>
            {linkedItems.map((item) => (
              <li key={item.id} className={styles.detailLinkedItem}>
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {sources && sources.length > 0 && (
        <div className={styles.detailSection}>
          <div className={styles.detailSectionHeader}>Sources</div>
          <ul className={styles.sourcesList}>
            {sources.map((source) => (
              <li key={source.id} className={styles.sourceItem}>
                <div className={styles.sourceTitle}>{source.title}</div>
                {source.excerpt && (
                  <div className={styles.sourceExcerpt}>{source.excerpt}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

interface RightPaneProps {
  isOpen: boolean;
  onClose: () => void;
  context?: RightPaneContext;
}

export default function RightPane({ isOpen, onClose, context }: RightPaneProps) {
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

  // TODO: Replace this placeholder UI with real chat/evidence renderer when backend is wired
  const showPlaceholder = !context || (context.type !== "chat" && context.type !== "evidence");

  return (
    <div
      ref={paneRef}
      className={`${styles.pane} ${isOpen ? styles.open : ""}`}
    >
      <div className={styles.header}>
        <span className={styles.label}>
          {context?.type === "sources"
            ? "sources"
            : (context?.subject ?? "Arbor")}
        </span>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close pane"
        >
          ✕
        </button>
      </div>

      <div className={styles.conversationArea}>
        {context?.type === "sources" && context.sources ? (
          <div className={styles.sourcesView}>
            <ArborSpeech>{sourcesOpeningLine(context.sources.length)}</ArborSpeech>
            <ul className={styles.sourcesList}>
              {context.sources.map((source) => (
                <li key={source.id} className={styles.sourceItem}>
                  <div className={styles.sourceTitle}>{source.title}</div>
                  {source.excerpt && (
                    <div className={styles.sourceExcerpt}>{source.excerpt}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : context?.type === "goalDetail" ? (
          <DetailView
            heading={context.detail?.title}
            headingSize="title"
            subtitle={context.detail?.subtitle ?? "Active goal"}
            body={context.detail?.body}
            linkedItemsHeader="Linked POVs"
            linkedItems={context.detail?.linkedItems}
            sources={context.sources}
          />
        ) : context?.type === "impactDetail" ? (
          <DetailView
            heading={context.detail?.title}
            headingSize="display"
            subtitle={context.detail?.subtitle}
            body={context.detail?.body}
            sources={context.sources}
          />
        ) : context?.type === "operatingProfileDetail" ? (
          <DetailView
            monoLabel={context.detail?.title}
            heading={context.detail?.subtitle}
            headingSize="title"
            body={context.detail?.body}
            sources={context.sources}
          />
        ) : context?.type === "skillDetail" ? (
          <DetailView
            monoLabel={context.detail?.title}
            heading={context.detail?.subtitle}
            headingSize="title"
            body={context.detail?.body}
            sources={context.sources}
          />
        ) : context?.type === "radarDetail" ? (
          <DetailView
            heading={context.detail?.title}
            headingSize="title"
            subtitle={context.detail?.subtitle}
            body={context.detail?.body}
            linkedItemsHeader="Axes"
            linkedItems={context.detail?.linkedItems}
            sources={context.sources}
          />
        ) : context?.type === "chat" && context.detail?.body ? (
          <ArborSpeech>{context.detail.body}</ArborSpeech>
        ) : context ? (
          <div className={styles.placeholderContent}>
            <div className={styles.contextType}>{context.type.toUpperCase()}</div>
            <h3 className={styles.contextSubject}>{context.subject ?? ""}</h3>
            <p className={styles.placeholderText}>{context.placeholder}</p>
          </div>
        ) : (
          <ArborSpeech>
            Hi Brian. We were talking about the staff hire last time. Want to
            pick that up, or start somewhere new?
          </ArborSpeech>
        )}
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
