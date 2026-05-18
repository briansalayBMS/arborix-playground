"use client";

import type { YouPlaceholderData } from "@/lib/placeholder/you-data";
import ExternalHero from "./ExternalHero";
import ImpactCards from "./ImpactCards";
import ExternalOperatingProfile from "./ExternalOperatingProfile";
import ExternalPersonality from "./ExternalPersonality";
import ExternalSkills from "./ExternalSkills";
import BottomAffordances from "./BottomAffordances";
import styles from "./ExternalView.module.css";

interface ExternalViewProps {
  data: YouPlaceholderData;
  onRequestLedgerAccess: () => void;
  onDownloadDossier: () => void;
}

export default function ExternalView({
  data,
  onRequestLedgerAccess,
  onDownloadDossier,
}: ExternalViewProps) {
  return (
    <div className={styles.view}>
      <ExternalHero
        title={data.externalHero.title}
        narrative={data.externalHero.narrative}
        verifiedDate={data.verifiedLastDate}
      />
      <ImpactCards cards={data.impactCards} />
      <ExternalOperatingProfile elements={data.operatingProfile} />
      <ExternalPersonality personality={data.personality} />
      <ExternalSkills skills={data.skills} />
      <BottomAffordances
        onRequestLedgerAccess={onRequestLedgerAccess}
        onDownloadDossier={onDownloadDossier}
      />
    </div>
  );
}
