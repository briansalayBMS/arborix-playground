"use client";

import type { YouPlaceholderData } from "@/lib/placeholder/you-data";
import Record from "@/components/record/Record";
import HeroVerdict from "./HeroVerdict";
import OperatingProfile from "./OperatingProfile";
import GoalsSection from "./GoalsSection";
import PersonalitySection from "./PersonalitySection";
import SkillsSection from "./SkillsSection";
import ConflictsSection from "./ConflictsSection";
import styles from "./InternalView.module.css";

interface InternalViewProps {
  data: YouPlaceholderData;
  onAddGoal: () => void;
  onCompareGoals: () => void;
  onTakeAssessment: () => void;
  onSendForPeerRatings: () => void;
}

export default function InternalView({
  data,
  onAddGoal,
  onCompareGoals,
  onTakeAssessment,
  onSendForPeerRatings,
}: InternalViewProps) {
  return (
    <div className={styles.view}>
      <HeroVerdict
        title={data.internalHero.title}
        body={data.internalHero.body}
        sources={data.internalHero.sources}
      />
      <OperatingProfile elements={data.operatingProfile} />
      <GoalsSection
        goals={data.goals}
        onAddGoal={onAddGoal}
        onCompareGoals={onCompareGoals}
      />
      <PersonalitySection
        personality={data.personality}
        onTakeAssessment={onTakeAssessment}
      />
      <SkillsSection
        skills={data.skills}
        onSendForPeerRatings={onSendForPeerRatings}
      />
      <ConflictsSection conflicts={data.conflicts} />
      <Record domain="you" />
    </div>
  );
}
