import { SealedArtifactsPanel } from "@/components/ingest/SealedArtifactsPanel";
import { InstrumentPlaceholder } from "@/components/layout/InstrumentPlaceholder";

export default function OkrsPage() {
  return (
    <div className="space-y-12">
      <InstrumentPlaceholder kicker="instrument · work · okrs" title="OKRs" />
      <SealedArtifactsPanel domain="WORK" />
    </div>
  );
}
