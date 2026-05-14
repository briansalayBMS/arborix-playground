import { SealedArtifactsPanel } from "@/components/ingest/SealedArtifactsPanel";
import { InstrumentPlaceholder } from "@/components/layout/InstrumentPlaceholder";

export default function PersonalityPage() {
  return (
    <div className="space-y-12">
      <InstrumentPlaceholder
        kicker="instrument · you · personality"
        title="Personality"
      />
      <SealedArtifactsPanel domain="YOU" />
    </div>
  );
}
