"use client";

import { useMemo, useState } from "react";
import { Share2 } from "lucide-react";
import { YOU_DATA } from "@/lib/placeholder/you-data";
import { useOnePager } from "@/lib/api/hooks/useOnePager";
import { applyOnePagerOverlay } from "@/lib/api/transformers/onepager";
import ModeToggle, { type YouMode } from "./ModeToggle";
import ShareDialog from "./ShareDialog";
import PlaceholderDialog from "./PlaceholderDialog";
import InternalView from "./internal/InternalView";
import ExternalView from "./external/ExternalView";
import styles from "./YouHub.module.css";

type PlaceholderKey =
  | "addGoal"
  | "compareGoals"
  | "takeAssessment"
  | "sendForPeerRatings"
  | "requestLedgerAccess"
  | "downloadDossier";

const PLACEHOLDER_COPY: Record<PlaceholderKey, { title: string; message: string }> = {
  addGoal: {
    title: "ADD A GOAL",
    message:
      "Adding goals opens in a future update. For now, the three goals shown are placeholders.",
  },
  compareGoals: {
    title: "COMPARE YOUR GOALS",
    message:
      "Pairwise comparison opens in a future update. For now, you can reorder your goals by editing them directly.",
  },
  takeAssessment: {
    title: "FULL ASSESSMENT",
    message: "Full assessment opens in a future update.",
  },
  sendForPeerRatings: {
    title: "PEER RATINGS",
    message:
      "Sending skills out for peer ratings opens in a future update.",
  },
  requestLedgerAccess: {
    title: "REQUEST LEDGER ACCESS",
    message: "This action opens in a future update.",
  },
  downloadDossier: {
    title: "DOWNLOAD VERIFIED DOSSIER",
    message: "This action opens in a future update.",
  },
};

export default function YouHub() {
  const [mode, setMode] = useState<YouMode>("internal");
  const [shareOpen, setShareOpen] = useState(false);
  const [placeholderKey, setPlaceholderKey] = useState<PlaceholderKey | null>(null);

  const onePager = useOnePager();
  const data = useMemo(
    () => applyOnePagerOverlay(YOU_DATA, onePager.data),
    [onePager.data],
  );

  const trigger = (key: PlaceholderKey) => () => setPlaceholderKey(key);

  return (
    <div className={styles.container}>
      <div className={styles.toggleRow}>
        <ModeToggle mode={mode} onChange={setMode} />
        <div
          className={styles.shareWrapper}
          aria-hidden={mode !== "external"}
        >
          <button
            type="button"
            className={styles.shareButton}
            onClick={() => setShareOpen((v) => !v)}
            aria-label="Share your profile"
            tabIndex={mode === "external" ? 0 : -1}
            style={{ visibility: mode === "external" ? "visible" : "hidden" }}
          >
            <Share2 size={18} strokeWidth={1.5} />
          </button>
          {mode === "external" && (
            <ShareDialog
              open={shareOpen}
              link={data.shareLinkPlaceholder}
              generatedDate={data.shareLinkGeneratedDate}
              onClose={() => setShareOpen(false)}
            />
          )}
        </div>
      </div>

      {mode === "internal" ? (
        <InternalView
          data={data}
          onAddGoal={trigger("addGoal")}
          onCompareGoals={trigger("compareGoals")}
          onTakeAssessment={trigger("takeAssessment")}
          onSendForPeerRatings={trigger("sendForPeerRatings")}
        />
      ) : (
        <ExternalView
          data={data}
          onRequestLedgerAccess={trigger("requestLedgerAccess")}
          onDownloadDossier={trigger("downloadDossier")}
        />
      )}

      <PlaceholderDialog
        open={placeholderKey !== null}
        title={placeholderKey ? PLACEHOLDER_COPY[placeholderKey].title : ""}
        message={placeholderKey ? PLACEHOLDER_COPY[placeholderKey].message : ""}
        onClose={() => setPlaceholderKey(null)}
      />
    </div>
  );
}
