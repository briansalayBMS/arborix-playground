"use client";

import SynthesizedView from "./SynthesizedView";
import HubSection from "./HubSection";
import EvidenceList from "./EvidenceList";
import CompletenessSignal from "./CompletenessSignal";
import styles from "./YouHub.module.css";

export default function YouHub() {
  const handleSectionLaunch = () => {
    // Stub for now
  };

  const handleGeneratePublicView = () => {
    // Stub for now
  };

  return (
    <div className={styles.container}>
      <SynthesizedView />

      <HubSection
        label="PERSONALITY"
        title="Strategic Driver"
        summary="Your dominant pattern is high-pace and task-oriented. You make decisions fast and you measure them against outcomes, not against process."
        cta="Take the full assessment →"
        onLaunch={handleSectionLaunch}
      />

      <HubSection
        label="SKILLS"
        title="Product leadership"
        summary="Your record shows depth in product strategy, organizational design, and turning ambiguity into shipped work. Peer ratings will sharpen this."
        cta="Review your skills →"
        onLaunch={handleSectionLaunch}
      />

      <HubSection
        label="GOALS"
        title="Three active goals"
        summary="Lead a meaningful product transformation. Mentor at least two strong PMs to senior. Stay in roles where the strategic and the operational are not separated."
        cta="Refine your goals →"
        onLaunch={handleSectionLaunch}
      />

      <EvidenceList />

      <CompletenessSignal />

      <button
        className={styles.generateButton}
        onClick={handleGeneratePublicView}
      >
        Generate a Public View
      </button>
    </div>
  );
}
