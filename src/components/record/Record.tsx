"use client";

import { useState } from "react";
import { useLedger } from "@/lib/api/hooks/useLedger";
import type { LedgerDomain, LedgerItem } from "@/lib/api/types";
import RecordCategory from "./RecordCategory";
import styles from "./Record.module.css";

interface CategoryDef {
  key: string;
  label: string;
  emptyCopy: string;
  chatSubject: string;
}

const CATEGORY_DEFS: Record<LedgerDomain, CategoryDef[]> = {
  you: [
    {
      key: "skill",
      label: "SKILLS",
      emptyCopy:
        "Tell me about a project you're proud of and I'll start mapping your skills. Or upload your resume.",
      chatSubject: "your skills",
    },
    {
      key: "strength",
      label: "STRENGTHS",
      emptyCopy:
        "Strengths emerge from patterns across sessions. Talk to me a few times and I'll start picking them up.",
      chatSubject: "your strengths",
    },
    {
      key: "value",
      label: "VALUES",
      emptyCopy:
        "Tell me what you work by and I'll start surfacing your values.",
      chatSubject: "your values",
    },
    {
      key: "growth_area",
      label: "GROWTH AREAS",
      emptyCopy:
        "Mention what you're working on improving and I'll start tracking it.",
      chatSubject: "your growth areas",
    },
    {
      key: "identity",
      label: "IDENTITY",
      emptyCopy:
        "Tell me how you'd describe yourself to a recruiter.",
      chatSubject: "your identity",
    },
  ],
  work: [
    {
      key: "achievement",
      label: "ACHIEVEMENTS",
      emptyCopy: "Tell me about something you shipped. Specific numbers help.",
      chatSubject: "your achievements",
    },
    {
      key: "project",
      label: "PROJECTS",
      emptyCopy: "Tell me about a project you've been leading.",
      chatSubject: "your projects",
    },
    {
      key: "decision",
      label: "DECISIONS",
      emptyCopy: "Share a decision you made recently that mattered.",
      chatSubject: "your decisions",
    },
    {
      key: "impact",
      label: "IMPACT",
      emptyCopy: "Tell me what changed because of your work.",
      chatSubject: "your impact",
    },
  ],
  company: [
    {
      key: "manager_relationship",
      label: "MANAGER",
      emptyCopy:
        "Tell me about your manager — name, style, where you sit on each other's radar.",
      chatSubject: "your manager",
    },
    {
      key: "stakeholder",
      label: "STAKEHOLDERS",
      emptyCopy: "Tell me about someone you work with across the org.",
      chatSubject: "your stakeholders",
    },
    {
      key: "team_context",
      label: "TEAM",
      emptyCopy:
        "Tell me about your team — size, your role, how you came together.",
      chatSubject: "your team",
    },
    {
      key: "company_context",
      label: "COMPANY CONTEXT",
      emptyCopy:
        "Tell me about your company — mission, your team's place in it.",
      chatSubject: "your company",
    },
  ],
};

function partitionItems(
  items: LedgerItem[],
  defs: CategoryDef[],
): { byCategory: Map<string, LedgerItem[]>; uncategorized: LedgerItem[] } {
  const knownKeys = new Set(defs.map((d) => d.key));
  const byCategory = new Map<string, LedgerItem[]>();
  for (const def of defs) byCategory.set(def.key, []);
  const uncategorized: LedgerItem[] = [];
  for (const item of items) {
    if (item.category && knownKeys.has(item.category)) {
      byCategory.get(item.category)!.push(item);
    } else {
      uncategorized.push(item);
    }
  }
  return { byCategory, uncategorized };
}

interface RecordProps {
  domain: LedgerDomain;
}

export default function Record({ domain }: RecordProps) {
  const ledger = useLedger();
  const [expanded, setExpanded] = useState(false);

  const items = ledger.data ? ledger.data[domain] : [];
  const count = items.length;
  const defs = CATEGORY_DEFS[domain];
  const { byCategory, uncategorized } = partitionItems(items, defs);

  return (
    <section className={styles.section}>
      <button
        type="button"
        className={styles.header}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <span className={styles.title}>YOUR RECORD</span>
        <span className={styles.separator} aria-hidden>·</span>
        <span className={styles.count}>
          {count} {count === 1 ? "claim" : "claims"}
        </span>
        <span className={styles.chevron} aria-hidden>
          {expanded ? "▴" : "▾"}
        </span>
      </button>
      {expanded && (
        <div className={styles.body}>
          {defs.map((def) => (
            <RecordCategory
              key={def.key}
              label={def.label}
              items={byCategory.get(def.key) ?? []}
              emptyCopy={def.emptyCopy}
              chatSubject={def.chatSubject}
            />
          ))}
          {uncategorized.length > 0 && (
            <RecordCategory
              label="UNCATEGORIZED"
              items={uncategorized}
            />
          )}
        </div>
      )}
    </section>
  );
}
