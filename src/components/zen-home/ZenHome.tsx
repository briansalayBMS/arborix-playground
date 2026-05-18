"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./ZenHome.module.css";
import HomeWelcome from "@/components/whats-in-play/HomeWelcome";
import WhatsInPlayItem from "@/components/whats-in-play/WhatsInPlayItem";
import type { Source } from "@/components/right-pane/RightPane";

/**
 * Placeholder goals data representing what the backend will eventually return.
 */
const PLACEHOLDER_GOALS = {
  goal_director_role: {
    id: "goal_director_role",
    title: "Director role transition",
    priority: "high" as const,
  },
  goal_cross_functional: {
    id: "goal_cross_functional",
    title: "Build cross-functional influence",
    priority: "medium" as const,
  },
  goal_leadership_narrative: {
    id: "goal_leadership_narrative",
    title: "Sharpen leadership narrative",
    priority: "low" as const,
  },
};

/**
 * Placeholder source data per POV. Will be replaced with backend data once wired.
 */
const OBSERVATION_SOURCES: Source[] = [
  { id: "src_li_p4", type: "document", title: "LinkedIn_Profile.pdf · p.4", excerpt: "Senior Product Designer at..." },
  { id: "src_resume_p1", type: "document", title: "Resume_2026.pdf · p.1", excerpt: "Led design organization through..." },
  { id: "src_resume_p2", type: "document", title: "Resume_2026.pdf · p.2", excerpt: "Drove cross-functional alignment..." },
];

const CONFLICT_SOURCES: Source[] = [
  { id: "src_session_1", type: "session", title: "Session 1 · 2026-04-27", excerpt: "I told him directly the work was..." },
  { id: "src_resume_p3", type: "document", title: "Resume_2026.pdf · p.3", excerpt: "Director-level scope across..." },
];

const PARTIAL_READ_SOURCES: Source[] = [
  { id: "src_li_p2", type: "document", title: "LinkedIn_Profile.pdf · p.2", excerpt: "Strategic Driver archetype..." },
];

/**
 * Navigation destinations for each interactive affordance on HOME.
 * Each destination describes where the affordance leads and what context is pre-loaded.
 */
const LINK_DESTINATIONS = {
  pickBackUp: {
    destination: "rightPane",
    context: "continuity",
    description: "Opens right pane pre-loaded with continuity context from last conversation",
  },
  povActionObservation: {
    destination: "rightPane",
    context: "chat",
    description: "Opens right pane with chat context to explore this observation together",
  },
  povActionConflict: {
    destination: "rightPane",
    context: "chat",
    description: "Opens right pane with chat context to dig into this conflict pattern",
  },
  povActionPartialRead: {
    destination: "rightPane",
    context: "chat",
    description: "Opens right pane with chat context to sharpen this personality read",
  },
  povChainlink: {
    destination: "rightPane",
    context: "sources",
    description: "Opens right pane with sources view for this POV",
  },
  completenessLink: {
    destination: "navigate",
    href: "/your-record",
    description: "Navigate to YOUR domain to view full record and profile completion details",
  },
  goalImpact: {
    destination: "rightPane",
    context: "goal",
    description: "Opens right pane showing the goal and how this POV affects it",
  },
} as const;

export default function ZenHome() {
  return (
    <main className={styles.main}>
      <div className={styles.section}>
        <HomeWelcome />
      </div>

      <div className={styles.itemsSection}>
        <WhatsInPlayItem
          type="observation"
          povId="pov_third_person"
          pov="You describe your work in third person more than you realize. Worth looking at what that protects."
          sources={OBSERVATION_SOURCES}
          action="Let's look at this together →"
          goalLinks={[
            { goalId: "goal_director_role", impactStrength: "high" },
            { goalId: "goal_cross_functional", impactStrength: "medium" },
          ]}
          goals={PLACEHOLDER_GOALS}
        />

        <WhatsInPlayItem
          type="conflict"
          povId="pov_director_conflict"
          pov="You said you want a Director role. The pattern in your last three quarters is avoiding cross-functional rooms. The two do not fit yet."
          sources={CONFLICT_SOURCES}
          action="Let me push on this with you →"
          goalLinks={[
            { goalId: "goal_director_role", impactStrength: "high" },
            { goalId: "goal_cross_functional", impactStrength: "high" },
          ]}
          goals={PLACEHOLDER_GOALS}
        />

        <WhatsInPlayItem
          type="partial-read"
          povId="pov_strategic_driver"
          pov="My read on your operating style is Strategic Driver. It would sharpen considerably with the personality questions."
          sources={PARTIAL_READ_SOURCES}
          action="Give me ten minutes and I'll sharpen this →"
          goalLinks={[
            { goalId: "goal_director_role", impactStrength: "medium" },
            { goalId: "goal_leadership_narrative", impactStrength: "medium" },
          ]}
          goals={PLACEHOLDER_GOALS}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.recordLink}>
          Profile is 42% complete.{" "}
          <Link href="/you" className={styles.recordLinkAction}>
            View your{" "}
            <span className={styles.nowrapAction}>
              record
              <ArrowRight size={14} strokeWidth={1.5} className={styles.recordLinkArrow} />
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
