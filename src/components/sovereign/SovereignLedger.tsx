"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { useDemoFirstTime } from "@/context/DemoFirstTimeContext";
import { useDiagnosticFocus } from "@/context/DiagnosticFocusContext";
import { useRightRailDrawer } from "@/context/RightRailDrawerContext";
import { useSovereignCommand } from "@/context/SovereignCommandContext";
import {
  activeToggleStorageKey,
  adjustForLedgerDomain,
  buildAuditorChainAnalysis,
  customRowsStorageKey,
  inferFileTypeFromName,
  LEDGER_ARTIFACT_DETAILS,
  resolveArtifactSources,
  sealedStorageKey,
  SOVEREIGN_LEDGER_EVIDENCE,
  type LedgerArtifactDetail,
  type SovereignLedgerDomain,
} from "@/lib/sovereignLedgerDomain";

type RegistryRow = {
  key: string;
  recordId: string;
  asset: string;
  adjust: string;
  status: "pending" | "sealed";
  detail: LedgerArtifactDetail;
};

type StoredCustom = {
  recordId: string;
  asset: string;
  source: string;
  dateMounted: string;
};

function noEmDash(s: string): string {
  return s.replace(/\u2014/g, "-");
}

function loadSealedIds(domain: SovereignLedgerDomain): Set<string> {
  try {
    const raw = localStorage.getItem(sealedStorageKey(domain));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set();
  }
}

function saveSealedIds(domain: SovereignLedgerDomain, ids: Set<string>) {
  try {
    localStorage.setItem(sealedStorageKey(domain), JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

function loadActiveMap(domain: SovereignLedgerDomain): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(activeToggleStorageKey(domain));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as Record<string, boolean>;
  } catch {
    return {};
  }
}

function saveActiveMap(domain: SovereignLedgerDomain, m: Record<string, boolean>) {
  try {
    localStorage.setItem(activeToggleStorageKey(domain), JSON.stringify(m));
  } catch {
    /* ignore */
  }
}

function loadCustomRows(domain: SovereignLedgerDomain): StoredCustom[] {
  try {
    const raw = localStorage.getItem(customRowsStorageKey(domain));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is StoredCustom =>
        typeof r === "object" &&
        r !== null &&
        typeof (r as StoredCustom).recordId === "string" &&
        typeof (r as StoredCustom).asset === "string",
    );
  } catch {
    return [];
  }
}

function saveCustomRows(domain: SovereignLedgerDomain, rows: StoredCustom[]) {
  try {
    localStorage.setItem(customRowsStorageKey(domain), JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

function detailForRecord(recordId: string, asset: string, sourceFallback: string): LedgerArtifactDetail {
  const known = LEDGER_ARTIFACT_DETAILS[recordId];
  if (known) return known;
  const fileType = inferFileTypeFromName(asset);
  return {
    source: sourceFallback,
    fileType,
    dateMounted: new Date().toISOString().slice(0, 10),
    auditorNotes:
      "User-mounted artifact. Radar adjustment applies when Active is ON and the line is sealed where policy requires.",
  };
}

function LedgerToggle({
  active,
  onToggle,
  labelledBy,
}: {
  active: boolean;
  onToggle: () => void;
  labelledBy: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-labelledby={labelledBy}
      onClick={onToggle}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full border-[0.5px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        active ? "border-[#06B6D4] bg-[#E0F5FF]" : "border-slate-300 bg-slate-100",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none",
          active && "translate-x-4",
        )}
        aria-hidden
      />
    </button>
  );
}

export type SovereignLedgerProps = {
  domain: SovereignLedgerDomain;
  className?: string;
};

export function SovereignLedger({ domain, className }: SovereignLedgerProps) {
  const { triggerRadarLedgerPulse, setYouLedgerActiveRatio } = useDiagnosticFocus();
  const { personalityPhase1Complete, setAuditCalibrationPercent, archetypeVerdict } =
    useSovereignCommand();
  const { simulationActive, isDemoSealed, sealDemoRecord } = useDemoFirstTime();
  const { open: openAssetInspector, selectedKey } = useRightRailDrawer();
  const demoYOU = simulationActive && domain === "YOU";
  const [mounted, setMounted] = useState(false);
  const [sealedIds, setSealedIds] = useState<Set<string>>(() => new Set());
  const [activeById, setActiveById] = useState<Record<string, boolean>>({});
  const [customRows, setCustomRows] = useState<StoredCustom[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [mountOpen, setMountOpen] = useState(false);
  const [mountInput, setMountInput] = useState("");

  useEffect(() => {
    setMounted(true);
    setSealedIds(loadSealedIds(domain));
    setActiveById(loadActiveMap(domain));
    setCustomRows(loadCustomRows(domain));
  }, [domain]);

  const adjustStr = adjustForLedgerDomain(domain);

  const rowSealed = useCallback(
    (recordId: string) => (demoYOU ? isDemoSealed(recordId) : sealedIds.has(recordId)),
    [demoYOU, isDemoSealed, sealedIds],
  );

  const rows = useMemo((): RegistryRow[] => {
    const base = SOVEREIGN_LEDGER_EVIDENCE[domain].map((ev) => {
      const sealed = rowSealed(ev.recordId);
      const detail = detailForRecord(ev.recordId, ev.asset, "sovereign:registry");
      const status: RegistryRow["status"] = sealed ? "sealed" : "pending";
      return {
        key: ev.recordId,
        recordId: ev.recordId,
        asset: ev.asset,
        adjust: adjustStr,
        status,
        detail,
      };
    });
    const custom = customRows.map((cr) => {
      const sealed = rowSealed(cr.recordId);
      const detail = detailForRecord(cr.recordId, cr.asset, cr.source);
      const status: RegistryRow["status"] = sealed ? "sealed" : "pending";
      return {
        key: cr.recordId,
        recordId: cr.recordId,
        asset: cr.asset,
        adjust: adjustStr,
        status,
        detail,
      };
    });
    return [...base, ...custom];
  }, [domain, customRows, adjustStr, rowSealed]);

  const rowActive = useCallback(
    (recordId: string) => activeById[recordId] !== false,
    [activeById],
  );

  useEffect(() => {
    if (!mounted) return;
    if (domain !== "YOU") {
      setYouLedgerActiveRatio(1);
      return;
    }
    const total = rows.length;
    if (total === 0) {
      setYouLedgerActiveRatio(1);
      return;
    }
    const activeN = rows.filter((r) => activeById[r.recordId] !== false).length;
    setYouLedgerActiveRatio(activeN / total);
  }, [mounted, domain, rows, activeById, setYouLedgerActiveRatio]);

  useEffect(() => {
    if (!mounted || domain !== "YOU" || !personalityPhase1Complete) return;
    const total = rows.length;
    const ratio = total > 0 ? rows.filter((r) => activeById[r.recordId] !== false).length / total : 1;
    const target = Math.round(40 + ratio * 15);
    setAuditCalibrationPercent(target);
  }, [
    mounted,
    domain,
    rows,
    activeById,
    personalityPhase1Complete,
    setAuditCalibrationPercent,
  ]);

  const pendingCount = useMemo(
    () => rows.filter((r) => r.status === "pending").length,
    [rows],
  );

  const setActive = useCallback(
    (recordId: string, value: boolean) => {
      setActiveById((prev) => {
        const next = { ...prev, [recordId]: value };
        saveActiveMap(domain, next);
        return next;
      });
    },
    [domain],
  );

  const sealRow = useCallback(
    (recordId: string) => {
      if (demoYOU) {
        sealDemoRecord(recordId);
        triggerRadarLedgerPulse();
        return;
      }
      setSealedIds((prev) => {
        const next = new Set(prev);
        next.add(recordId);
        saveSealedIds(domain, next);
        return next;
      });
      if (domain === "YOU") triggerRadarLedgerPulse();
    },
    [demoYOU, domain, sealDemoRecord, triggerRadarLedgerPulse],
  );

  const addMountedAsset = useCallback(() => {
    const raw = mountInput.trim();
    if (!raw) return;
    const recordId = `MNT-${Date.now()}`;
    const asset = raw.includes("/") ? raw.split("/").pop() ?? raw : raw;
    const row: StoredCustom = {
      recordId,
      asset: asset || raw,
      source: raw.startsWith("http") ? raw : `file:${raw}`,
      dateMounted: new Date().toISOString().slice(0, 10),
    };
    setCustomRows((prev) => {
      const next = [...prev, row];
      saveCustomRows(domain, next);
      return next;
    });
    setMountInput("");
    setMountOpen(false);
  }, [mountInput, domain]);

  const headerLabel = domain === "YOU" ? "SOVEREIGN LEDGER" : `${domain} LEDGER`;

  const selectionKeyForRow = useCallback(
    (rowKey: string) => `${domain}:${rowKey}`,
    [domain],
  );

  const openInspector = useCallback(
    (row: RegistryRow) => {
      const sources = resolveArtifactSources(row.recordId, row.asset, row.detail);
      openAssetInspector({
        recordId: row.recordId,
        assetTitle: noEmDash(row.asset),
        sourcePath: row.detail.source,
        fileType: row.detail.fileType,
        timestamp: row.detail.dateMounted,
        sources,
        forensicVerdict: buildAuditorChainAnalysis(
          domain,
          row.recordId,
          row.asset,
          row.detail.auditorNotes,
          archetypeVerdict,
          sources,
        ),
        selectionKey: selectionKeyForRow(row.key),
      });
    },
    [archetypeVerdict, domain, openAssetInspector, selectionKeyForRow],
  );

  return (
    <section className={cn("flex w-full flex-col text-left", className)}>
      <div className="frame-museum overflow-hidden border-[0.5px] border-[var(--color-arborix-line)] bg-[var(--color-arborix-bg)]">
        <div className="flex w-full flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b-[0.5px] border-[#E2E8F0] bg-white/30 px-4 py-2.5 sm:px-5">
          <p className="m-0 min-w-0 font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#131517]">
            {headerLabel}
          </p>
          <div className="ml-auto flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setMountOpen((v) => !v)}
              className="rounded-none border-0 bg-transparent px-0 py-1 font-code text-[11px] font-semibold uppercase tracking-[0.12em] text-[#131517] outline-none hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
            >
              [ + MOUNT NEW ASSET ]
            </button>
            <span
              className="font-code text-[12px] font-normal uppercase tracking-[0.1em] text-[#131517]"
              aria-live="polite"
            >
              ({pendingCount} UNVERIFIED)
            </span>
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="rounded-none border-0 bg-transparent px-0 py-1 font-code text-[12px] font-normal uppercase tracking-[0.12em] text-[#131517] outline-none transition-opacity hover:opacity-80 focus-visible:ring-1 focus-visible:ring-[#06B6D4] focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none"
            >
              {expanded ? "[ COLLAPSE LEDGER ]" : "[ EXPAND LEDGER ]"}
            </button>
          </div>
        </div>

        {mountOpen ? (
          <div className="border-b-[0.5px] border-[#E2E8F0] bg-white px-4 py-3 sm:px-5">
            <p className="m-0 font-code text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">
              MOUNT PATH OR URL
            </p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={mountInput}
                onChange={(e) => setMountInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMountedAsset()}
                placeholder="https:// or /path/to/file.pdf"
                className="min-h-10 w-full min-w-0 flex-1 border-[0.5px] border-slate-300 bg-white px-3 py-2 font-code text-[13px] text-[#131517] outline-none placeholder:text-slate-400 focus-visible:border-[#06B6D4]/60"
              />
              <button
                type="button"
                onClick={addMountedAsset}
                className="shrink-0 rounded-none border-[0.5px] border-slate-400 bg-[#E0F5FF] px-4 py-2 font-code text-[11px] font-semibold uppercase tracking-[0.12em] text-[#131517] outline-none hover:bg-[#C0E8FF] focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
              >
                Add to ledger
              </button>
            </div>
          </div>
        ) : null}

        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-linear motion-reduce:duration-0",
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div
            className="min-h-0 overflow-hidden"
            aria-hidden={!expanded}
            {...(!expanded ? { inert: true as const } : {})}
          >
            <div className="flex min-h-0 w-full min-w-0 flex-col bg-white">
              <div className="min-w-0 flex-1">
                <div className="border-b-[0.5px] border-[#E2E8F0] bg-white/30 px-4 py-2.5 sm:px-5">
                  <p className="mono-label m-0 text-[#131517]">Verified registry</p>
                </div>

                <div className="w-full overflow-x-auto px-0 pb-4 pt-0">
                  <div
                    className="min-w-[min(100%,920px)] border-collapse text-left"
                    role="table"
                    aria-label="Sovereign verified registry"
                  >
                    <div
                      role="row"
                      className="grid grid-cols-[2.25rem_minmax(5rem,0.85fr)_minmax(9rem,1.4fr)_minmax(6.5rem,1fr)_minmax(7.5rem,1.1fr)_auto] items-end gap-0 border-b-[0.5px] border-[#E2E8F0] px-4 py-2 sm:px-5 sm:py-2.5"
                    >
                      <span className="block w-9 shrink-0 border-r-[0.5px] border-[#E2E8F0]" aria-hidden />
                      <span
                        role="columnheader"
                        className="border-r-[0.5px] border-[#E2E8F0] px-2 font-code text-[13px] font-semibold uppercase tracking-[0.08em] text-[#131517]"
                      >
                        Record (ID)
                      </span>
                      <span
                        role="columnheader"
                        className="border-r-[0.5px] border-[#E2E8F0] px-2 font-code text-[13px] font-semibold uppercase tracking-[0.08em] text-[#131517]"
                      >
                        Asset (Title)
                      </span>
                      <span
                        role="columnheader"
                        className="border-r-[0.5px] border-[#E2E8F0] px-2 font-code text-[13px] font-semibold uppercase tracking-[0.08em] text-[#131517]"
                      >
                        Adjust
                      </span>
                      <span
                        role="columnheader"
                        className="border-r-[0.5px] border-[#E2E8F0] px-2 font-code text-[13px] font-semibold uppercase tracking-[0.08em] text-[#131517]"
                      >
                        Verification
                      </span>
                      <span className="sr-only">Seal</span>
                    </div>

                    {mounted
                      ? rows.map((row) => {
                          const active = rowActive(row.recordId);
                          const labelId = `ledger-row-${row.key}`;
                          const rowSelected = selectedKey === selectionKeyForRow(row.key);
                          return (
                            <div
                              key={row.key}
                              role="row"
                              className={cn(
                                "grid grid-cols-[2.25rem_minmax(5rem,0.85fr)_minmax(9rem,1.4fr)_minmax(6.5rem,1fr)_minmax(7.5rem,1.1fr)_auto] items-center gap-0 border-b-[0.5px] border-[#E2E8F0] px-4 py-1.5 sm:px-5 sm:py-2",
                                rowSelected && "bg-[#E0F5FF]/35",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-full items-center border-r-[0.5px] border-[#E2E8F0] pl-0.5",
                                  rowSelected && "border-l border-l-[#06B6D4] pl-0",
                                )}
                              >
                                <LedgerToggle
                                  active={active}
                                  labelledBy={labelId}
                                  onToggle={() => setActive(row.recordId, !active)}
                                />
                              </div>
                              <span
                                id={labelId}
                                className="border-r-[0.5px] border-[#E2E8F0] px-2 font-code text-[13px] font-normal tabular-nums leading-tight text-[#131517]"
                              >
                                {row.recordId}
                              </span>
                              <button
                                type="button"
                                onClick={() => openInspector(row)}
                                className="min-w-0 cursor-pointer border-r-[0.5px] border-[#E2E8F0] bg-transparent px-2 py-0 text-left font-code text-[13px] font-normal leading-tight text-[#131517] underline-offset-2 hover:underline focus-visible:rounded-sm focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
                              >
                                {noEmDash(row.asset)}
                              </button>
                              <span
                                className={cn(
                                  "border-r-[0.5px] border-[#E2E8F0] px-2 font-code text-[13px] font-normal leading-tight transition-colors",
                                  active ? "text-[#131517]" : "text-slate-400",
                                )}
                              >
                                {row.adjust}
                              </span>
                              <div className="min-w-0 border-r-[0.5px] border-[#E2E8F0] px-2">
                                {row.status === "pending" ? (
                                  <span className="inline-flex rounded border border-dashed border-slate-400 px-2 py-0.5 font-code text-[13px] font-normal leading-tight text-slate-600">
                                    Pending seal
                                  </span>
                                ) : (
                                  <span className="inline-flex rounded-sm bg-[#06B6D4] px-2 py-0.5 font-code text-[13px] font-semibold uppercase tracking-[0.06em] text-white">
                                    SEALED
                                  </span>
                                )}
                              </div>
                              <div className="flex shrink-0 justify-end">
                                {row.status === "pending" ? (
                                  <button
                                    type="button"
                                    onClick={() => sealRow(row.recordId)}
                                    className="rounded-none border-[0.5px] border-slate-400 bg-white px-2 py-1 font-code text-[10px] font-semibold uppercase tracking-[0.1em] text-[#131517] outline-none transition-colors hover:bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-[#06B6D4]"
                                  >
                                    [ SEAL RECORD ]
                                  </button>
                                ) : (
                                  <span className="font-code text-[10px] font-medium uppercase tracking-[0.08em] text-[#64748B]">
                                    Sealed
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { MasterSovereignLedger } from "./MasterSovereignLedger";
