import type { Source } from "@/components/right-pane/RightPane";

export type GoalLink = { goalId: string; impactStrength: "high" | "medium" | "low" };

export type GoalActivityState = "ACTIVE" | "WARMING UP" | "DORMANT";

export interface Goal {
  id: string;
  title: string;
  priority: number;
  arborPovSurface: string;
  arborPov: string;
  sources: Source[];
  goalLinks: GoalLink[];
  activityState: GoalActivityState;
  lastTouched: string;
}

export interface OperatingProfileElement {
  key: "operating-mode" | "environment" | "priority-bias";
  label: string;
  value: string;
  arborExplanation: string;
  sources: Source[];
}

export interface ImpactCard {
  id: string;
  label: "IMPACT" | "SIGNAL" | "VELOCITY";
  metric: string;
  narrative: string;
  delta: string;
  paneSubtitle: string;
  sources: Source[];
}

export interface DiscAxis {
  name: string;
  value: number;
  flagged?: boolean;
  arborRead: string;
}

export interface PersonalityArchetype {
  name: string;
  subtitle: string;
  description: string;
  axes: DiscAxis[];
  radarSources: Source[];
  radarArborRead: string;
}

export interface Skill {
  name: string;
  selfRating: string;
  peerRating?: string;
  arborExplanation: string;
  sources: Source[];
}

export interface Conflict {
  id: string;
  title: string;
  body: string;
  arborQuestion: string;
  estimatedTime: string;
  sources: Source[];
}

export interface YouPlaceholderData {
  internalHero: { title: string; body: string; sources: Source[] };
  externalHero: { title: string; narrative: string };
  operatingProfile: OperatingProfileElement[];
  goals: Goal[];
  personality: PersonalityArchetype;
  skills: Skill[];
  conflicts: Conflict[];
  impactCards: ImpactCard[];
  verifiedLastDate: string;
  shareLinkPlaceholder: string;
  shareLinkGeneratedDate: string;
}

const SRC_RESUME_P1: Source = {
  id: "resume_p1",
  type: "document",
  title: "Resume_2026.pdf · p.1",
  excerpt: "Led design organization through three product transformations...",
};
const SRC_RESUME_P2: Source = {
  id: "resume_p2",
  type: "document",
  title: "Resume_2026.pdf · p.2",
  excerpt: "Drove cross-functional alignment across product, engineering, and finance...",
};
const SRC_RESUME_P3: Source = {
  id: "resume_p3",
  type: "document",
  title: "Resume_2026.pdf · p.3",
  excerpt: "Director-level scope across three flagship initiatives in the last four quarters.",
};
const SRC_LINKEDIN_P2: Source = {
  id: "linkedin_p2",
  type: "document",
  title: "LinkedIn_Profile.pdf · p.2",
  excerpt: "Strategic Driver archetype emerging across recent role transitions.",
};
const SRC_LINKEDIN_P4: Source = {
  id: "linkedin_p4",
  type: "document",
  title: "LinkedIn_Profile.pdf · p.4",
  excerpt: "Senior Product Designer at... promoted within 18 months.",
};
const SRC_SESSION_1: Source = {
  id: "session_1",
  type: "session",
  title: "Session 1 · 2026-04-27",
  excerpt: "I told him directly the work was not going to land the way he framed it...",
};
const SRC_SESSION_2: Source = {
  id: "session_2",
  type: "session",
  title: "Session 2 · 2026-05-04",
  excerpt: "I keep coming back to the bad project at TechCorp — the way the team misaligned under pressure...",
};
const SRC_SESSION_3: Source = {
  id: "session_3",
  type: "session",
  title: "Session 3 · 2026-05-11",
  excerpt: "The two functions I rarely touch are Finance and CS. Both have been distant for a year.",
};
const SRC_SESSION_4: Source = {
  id: "session_4",
  type: "session",
  title: "Session 4 · 2026-05-15",
  excerpt: "Design-as-decision-making — that's the through-line for me, even when I don't name it that way.",
};
const SRC_REVIEW_Q1: Source = {
  id: "review_q1",
  type: "document",
  title: "Performance_Review_Q1.pdf",
  excerpt: "Brian's instrumentation framework became the team's reference model for cross-functional metric work.",
};
const SRC_RENEWAL_DECK: Source = {
  id: "renewal_deck",
  type: "document",
  title: "Renewal_Narrative_Q4.pdf",
  excerpt: "Procurement leadership cited the technical narrative as decisive in the renewal decision.",
};
const SRC_PROMO_PACKET: Source = {
  id: "promo_packet",
  type: "document",
  title: "Promotion_Packet_2025.pdf",
  excerpt: "Cross-functional launch ownership confirmed by VP-level peer feedback.",
};
const SRC_PEER_FEEDBACK: Source = {
  id: "peer_feedback_2026",
  type: "document",
  title: "Peer_Feedback_Roundtable_Q1.pdf",
  excerpt: "Three peers independently named Brian's framing as the move that unstuck the program.",
};
const SRC_PORTFOLIO: Source = {
  id: "portfolio_2026",
  type: "document",
  title: "Portfolio_2026.pdf",
  excerpt: "Recent visual work across three shipped products.",
};
const SRC_TECH_SPEC: Source = {
  id: "tech_spec_v3",
  type: "document",
  title: "Tech_Spec_Migration_v3.md",
  excerpt: "Brian co-authored the migration architecture with the platform team.",
};

const TODAY = "May 18, 2026";

export const YOU_DATA: YouPlaceholderData = {
  internalHero: {
    title:
      "Brian, you are strong in judgment under uncertainty.",
    body:
      "You compress complexity without erasing tradeoffs — this quarter, three high-stakes initiatives landed clean and one cross-org alignment moment held under real pressure. The pattern puts you operating at the upper end of Senior, with most of the Director-level signals already present. The thinner part of the picture is how senior people two functions away from you read your scope. What stays open for the next cycle is whether the work you have already done becomes more visible in your own narrative.",
    sources: [SRC_RESUME_P1, SRC_RESUME_P2, SRC_SESSION_2, SRC_SESSION_4, SRC_REVIEW_Q1],
  },

  externalHero: {
    title:
      "Brian Salay is a senior product leader whose work outlives the meeting it came from.",
    narrative:
      "He compresses complexity without erasing tradeoffs, then stands behind the instrumentation that makes those decisions defensible. Three high-stakes initiatives shipped clean this quarter; one cross-org alignment moment held under real pressure. Positioned at the upper end of Senior, with most Director-level signals already present. The work he leaves behind is the kind organizations operate from, not the kind they only applaud.",
  },

  operatingProfile: [
    {
      key: "operating-mode",
      label: "OPERATING MODE",
      value: "Influence and pace expansion",
      arborExplanation:
        "This is the posture Arbor sees you operating from most consistently. It comes from reading your last four sessions and your resume. Worth knowing: your operating mode and your environment fit together — the pace expansion you favor matches the coalition-shaping you've put yourself in.",
      sources: [SRC_SESSION_1, SRC_SESSION_2, SRC_RESUME_P2],
    },
    {
      key: "environment",
      label: "ENVIRONMENT",
      value: "High-frequency coalition shaping",
      arborExplanation:
        "Your environment leans toward many small coalition moves rather than fewer large ones. Most of your recent record shows you operating across function boundaries at high cadence — the rhythm of work you have chosen, not just the work you were given.",
      sources: [SRC_SESSION_3, SRC_RESUME_P2],
    },
    {
      key: "priority-bias",
      label: "PRIORITY BIAS",
      value: "Over-extension under ambiguous sponsorship",
      arborExplanation:
        "When sponsorship is unclear, your pattern is to take on more rather than pause. This shows up in the ledger as breadth without a clean owner on the upstream framing. It is the most consistent risk in your operating style and the one most worth watching.",
      sources: [SRC_SESSION_2, SRC_SESSION_4, SRC_REVIEW_Q1],
    },
  ],

  goals: [
    {
      id: "goal_director_role",
      title: "Director role transition",
      priority: 1,
      arborPovSurface:
        "You have the output for this. What stays uncertain is how your record reads without the context you carry in your head.",
      arborPov:
        "You have the output for this. The pattern in your last quarter — three high-stakes shipped initiatives, one cross-org alignment moment that worked — reads as Director-shaped already. What stays uncertain is how recruiters or your VP would read your last six months without context. The next thing worth working on here is making the Director-level scope of what you have already done visible in your own narrative.",
      sources: [SRC_RESUME_P1, SRC_RESUME_P3, SRC_SESSION_2],
      goalLinks: [],
      activityState: "ACTIVE",
      lastTouched: "last touched 3 days ago",
    },
    {
      id: "goal_cross_functional",
      title: "Build cross-functional influence",
      priority: 2,
      arborPovSurface:
        "Mixed read. You go deep locally and thin two functions out. Worth asking whether that's time or discomfort.",
      arborPov:
        "This one is a mixed read. You build deep working relationships with the people you sit closest to, but there is a thinness in your record around relationships with peers two functions away. Worth thinking about: is that a time problem or a discomfort problem? The pattern in recent sessions suggests the second.",
      sources: [SRC_SESSION_1, SRC_SESSION_3],
      goalLinks: [],
      activityState: "ACTIVE",
      lastTouched: "last touched 8 days ago",
    },
    {
      id: "goal_leadership_narrative",
      title: "Sharpen leadership narrative",
      priority: 3,
      arborPovSurface:
        "Early days. I have threads — design-as-decision-making, how teams misalign under pressure — but they have not joined into one story yet.",
      arborPov:
        "Early days on this one. I have a few threads — your interest in design-as-decision-making, your read on how teams misalign under pressure, the way you talk about the bad project at TechCorp — but they have not joined into one story yet. Give me a few more sessions and I think the shape will surface.",
      sources: [SRC_SESSION_2, SRC_SESSION_4],
      goalLinks: [],
      activityState: "WARMING UP",
      lastTouched: "last touched 2 days ago",
    },
  ],

  personality: {
    name: "Initiator",
    subtitle: "Your dominant operating posture.",
    description:
      "High-Pace, People-Oriented. You excel at rallying teams around new ideas, energy comes from forward motion, decision speed exceeds the organizational baseline.",
    axes: [
      {
        name: "Dominance",
        value: 0.65,
        arborRead: "Comfortable taking ground when the work needs a decision.",
      },
      {
        name: "Influence",
        value: 0.74,
        arborRead: "Reads as the strongest axis — you persuade more often than you push.",
      },
      {
        name: "Steadiness",
        value: 0.64,
        arborRead: "You hold under pressure, but pressure is also when you change pace fastest.",
      },
      {
        name: "Conscientiousness",
        value: 0.79,
        arborRead: "High discipline shows up in how your record holds together over time.",
      },
      {
        name: "Agility",
        value: 0.71,
        arborRead: "You move with the work rather than against it.",
      },
      {
        name: "Pace",
        value: 0.55,
        flagged: true,
        arborRead:
          "The lowest-confidence axis. The read here is thin — worth more sessions before treating it as load-bearing.",
      },
      {
        name: "Priority",
        value: 0.82,
        arborRead: "Your sense of what to do next is unusually settled.",
      },
      {
        name: "Empathy",
        value: 0.68,
        arborRead: "Steady — you read rooms well in your immediate orbit.",
      },
    ],
    radarSources: [SRC_LINKEDIN_P2, SRC_SESSION_1, SRC_SESSION_3, SRC_SESSION_4],
    radarArborRead:
      "The radar is a way of seeing how your operating posture distributes across eight dimensions. Treat it as an instrument, not a target — the axes serve the work you are doing, not the other way around.",
  },

  skills: [
    {
      name: "Product strategy",
      selfRating: "Top 10%",
      arborExplanation:
        "Strongest signal across your record. Three shipped initiatives in the last four quarters where you owned the framing, not just the execution.",
      sources: [SRC_RESUME_P1, SRC_REVIEW_Q1, SRC_RENEWAL_DECK],
    },
    {
      name: "Cross-functional leadership",
      selfRating: "Top 25%",
      arborExplanation:
        "Strong locally, thinner across function boundaries. Peers two functions away from you have less to say than peers in your immediate orbit.",
      sources: [SRC_PEER_FEEDBACK, SRC_SESSION_3],
    },
    {
      name: "User research synthesis",
      selfRating: "Top 10%",
      arborExplanation:
        "You compress research without losing the dissonance — readers come away with the right tensions, not just the right answers.",
      sources: [SRC_RESUME_P2, SRC_SESSION_4],
    },
    {
      name: "Visual design execution",
      selfRating: "2nd quartile",
      arborExplanation:
        "Honest self-assessment. Your visual craft is solid but not where you compete; you lead on framing and judgment more than on pixels.",
      sources: [SRC_PORTFOLIO],
    },
    {
      name: "Technical literacy",
      selfRating: "Top 25%",
      arborExplanation:
        "Above average for the role. You hold your own in architecture conversations and ship work that the engineering side can extend.",
      sources: [SRC_TECH_SPEC, SRC_RESUME_P1],
    },
  ],

  conflicts: [
    {
      id: "conflict_strategic_tactical",
      title: "Strategic vs. tactical friction",
      body:
        "You repeatedly absorb strategy work while owning execution depth. The ledger shows outsized craft signal with compressed horizon for upstream framing.",
      arborQuestion:
        "Where does peer review friction surface in your workflow, and what would materially change the outcome?",
      estimatedTime: "~3 min",
      sources: [SRC_SESSION_2, SRC_RESUME_P3],
    },
    {
      id: "conflict_narrative_compression",
      title: "Narrative compression under load",
      body:
        "When timelines compress, your external narrative tightens to outcomes (healthy), but internal reviewers lose traceability to the decision graph.",
      arborQuestion:
        "When you name the initiative to demote, what is the single leading indicator you track weekly, and who owns the readout?",
      estimatedTime: "~3 min",
      sources: [SRC_REVIEW_Q1, SRC_SESSION_4],
    },
    {
      id: "conflict_influence_map",
      title: "Influence map thinness",
      body:
        "You build deep working relationships locally but have few senior connections outside your immediate team. This is the same thread as Goal 2 — worth knowing it shows up here as a sourced finding.",
      arborQuestion:
        "If you had to name one senior person two levels above you that you have not had a non-deliverable conversation with this quarter, who comes to mind?",
      estimatedTime: "~3 min",
      sources: [SRC_SESSION_3, SRC_LINKEDIN_P2],
    },
  ],

  impactCards: [
    {
      id: "impact_arr",
      label: "IMPACT",
      metric: "$4.2M",
      narrative:
        "ARR expansion delivered with zero discounting. Procurement leadership cited the technical narrative as decisive in the renewal decision.",
      delta: "+0.04 commercial",
      paneSubtitle: "ARR expansion",
      sources: [SRC_RENEWAL_DECK, SRC_RESUME_P1],
    },
    {
      id: "impact_variance",
      label: "SIGNAL",
      metric: "31%",
      narrative:
        "Reduction in month-close variance after Finance adopted the instrumentation framework. Process became the team's reference model for cross-functional metric work.",
      delta: "+0.03 signal",
      paneSubtitle: "Month-close variance reduction",
      sources: [SRC_REVIEW_Q1, SRC_RESUME_P2],
    },
    {
      id: "impact_velocity",
      label: "VELOCITY",
      metric: "L6→L7",
      narrative:
        "Promotion trajectory confirmed by cross-functional launch ownership. Measurable NPS lift across two product lines following the leadership transition.",
      delta: "+0.02 growth",
      paneSubtitle: "Promotion trajectory",
      sources: [SRC_PROMO_PACKET, SRC_LINKEDIN_P4],
    },
  ],

  verifiedLastDate: TODAY,
  shareLinkPlaceholder: "https://arborix.app/s/ext-bri7k",
  shareLinkGeneratedDate: TODAY,
};
