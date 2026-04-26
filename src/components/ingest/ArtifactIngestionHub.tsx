"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { useIngestLedger } from "@/components/providers/IngestLedgerProvider";
import {
  buildInquiryMessage,
  type LedgerDomain,
} from "@/lib/ingestLedger";
import { cn } from "@/lib/cn";

type MountMode = "url" | "file" | "text";

const DOMAIN_OPTIONS: LedgerDomain[] = ["YOU", "COMPANY", "WORK"];

export function ArtifactIngestionHub() {
  const fileInputId = useId();
  const intentId = useId();
  const { log, appendRow, setDomain, sealRecord } = useIngestLedger();

  const [mode, setMode] = useState<MountMode>("url");
  const [urlValue, setUrlValue] = useState("");
  const [textValue, setTextValue] = useState("");
  const [intentValue, setIntentValue] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const inquiryRow = useMemo(
    () => log.find((r) => !r.sealed && r.verificationRequired),
    [log],
  );

  const inquiryCopy = useMemo(
    () => (inquiryRow ? buildInquiryMessage(inquiryRow) : ""),
    [inquiryRow],
  );

  const modes = useMemo(
    () =>
      [
        { id: "url" as const, label: "[ URL ]" },
        { id: "file" as const, label: "[ FILE ]" },
        { id: "text" as const, label: "[ TEXT ]" },
      ] as const,
    [],
  );

  const pushFileRow = useCallback(
    (f: File) => {
      const today = new Date().toISOString().slice(0, 10);
      appendRow({
        source: f.name,
        type: "FILE",
        ingestedAt: today,
        intent: intentValue.trim() || undefined,
      });
    },
    [appendRow, intentValue],
  );

  const onMount = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    const intent = intentValue.trim() || undefined;
    if (mode === "url") {
      const v = urlValue.trim();
      if (!v) return;
      appendRow({ source: v, type: "URL", ingestedAt: today, intent });
      setUrlValue("");
      setIntentValue("");
      return;
    }
    if (mode === "file") {
      if (!pendingFile) return;
      pushFileRow(pendingFile);
      setPendingFile(null);
      setIntentValue("");
      return;
    }
    if (mode === "text") {
      const v = textValue.trim();
      if (!v) return;
      const source = v.length > 48 ? `${v.slice(0, 45)}…` : v;
      appendRow({ source, type: "TEXT", ingestedAt: today, intent });
      setTextValue("");
      setIntentValue("");
    }
  }, [mode, urlValue, textValue, pendingFile, pushFileRow, appendRow, intentValue]);

  const onFilePick = useCallback((files: FileList | null) => {
    const f = files?.[0];
    if (f) setPendingFile(f);
  }, []);

  const onFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) setPendingFile(f);
  }, []);

  return (
    <div className={cn("space-y-12", inquiryRow && "pb-28")}>
      <header className="space-y-3">
        <h1 className="font-ui m-0 text-[32px] font-bold leading-tight tracking-tight text-[#131517]">
          Artifact Ingestion
        </h1>
        <p className="font-ui m-0 max-w-3xl text-base font-normal leading-relaxed text-[#5C6166]">
          Feed the Auditor. Mount URLs, documents, or raw text into the sovereign record for
          forensic mapping.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-code m-0 text-[12px] font-bold uppercase tracking-[0.18em] text-[#5C6166]">
          Universal mount station
        </h2>

        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={cn(
                "font-code border-[0.5px] border-slate-400 bg-white px-3 py-2 text-[12px] font-normal uppercase tracking-wider transition-colors",
                mode === m.id
                  ? "text-[#131517]"
                  : "text-[#5C6166] hover:text-[#131517]",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="border-[0.5px] border-slate-400 bg-white p-4">
          {mode === "url" ? (
            <input
              type="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              placeholder="https://"
              className="font-code w-full border-0 bg-transparent p-0 text-sm font-normal text-[#131517] outline-none placeholder:text-[#5C6166]"
            />
          ) : null}

          {mode === "file" ? (
            <label
              htmlFor={fileInputId}
              className="block cursor-pointer"
              onDrop={onFileDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                id={fileInputId}
                type="file"
                accept=".pdf,.doc,.docx,.md,.markdown,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/plain"
                className="sr-only"
                onChange={(e) => onFilePick(e.target.files)}
              />
              <div className="font-code min-h-[88px] text-sm font-normal text-[#5C6166]">
                {pendingFile ? (
                  <span className="text-[#131517]">{pendingFile.name}</span>
                ) : (
                  <>Drop PDF, DOCX, or Markdown — or click to select</>
                )}
              </div>
            </label>
          ) : null}

          {mode === "text" ? (
            <textarea
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              rows={6}
              placeholder="Paste raw text…"
              className="font-code min-h-[120px] w-full resize-y border-0 bg-transparent p-0 text-sm font-normal text-[#131517] outline-none placeholder:text-[#5C6166]"
            />
          ) : null}
        </div>

        <div className="space-y-2">
          <label htmlFor={intentId} className="sr-only">
            Optional intent
          </label>
          <input
            id={intentId}
            type="text"
            value={intentValue}
            onChange={(e) => setIntentValue(e.target.value)}
            placeholder="[ OPTIONAL: TELL ARBORIX WHAT THIS IS ]"
            className="font-code w-full border-0 border-b-[0.5px] border-slate-400 bg-transparent p-0 py-2 text-sm font-normal text-[#131517] outline-none placeholder:text-[#5C6166]"
          />
        </div>

        <button
          type="button"
          onClick={onMount}
          className="cta-active"
        >
          MOUNT ARTIFACT
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="font-ui m-0 text-sm font-bold tracking-tight text-[#131517]">
          Forensic ledger
        </h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b-[0.5px] border-slate-400">
                <th
                  scope="col"
                  className="font-code py-3 pr-6 pl-0 text-[12px] font-bold uppercase tracking-widest text-[#5C6166]"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="font-code py-3 pr-6 pl-0 text-[12px] font-bold uppercase tracking-widest text-[#5C6166]"
                >
                  Domain
                </th>
                <th
                  scope="col"
                  className="font-code py-3 pl-0 text-[12px] font-bold uppercase tracking-widest text-[#5C6166]"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {log.map((row) => (
                <tr key={row.id} className="border-b-[0.5px] border-slate-400">
                  <td className="font-code py-3 pr-6 pl-0 align-top text-[12px] font-normal tabular-nums text-[#131517]">
                    {row.id}
                  </td>
                  <td className="py-3 pr-6 pl-0 align-top">
                    <div className="flex flex-col gap-1">
                      <span className="font-code text-sm font-bold text-slate-800">
                        {row.autoDetectedDomain}
                      </span>
                      {row.domain !== row.autoDetectedDomain ? (
                        <span className="font-code text-[11px] font-normal text-[#5C6166]">
                          Routing: {row.domain}
                        </span>
                      ) : null}
                      <label className="sr-only" htmlFor={`domain-${row.id}`}>
                        Correct domain for {row.id}
                      </label>
                      <select
                        id={`domain-${row.id}`}
                        value={row.domain}
                        disabled={row.sealed}
                        onChange={(e) =>
                          setDomain(row.id, e.target.value as LedgerDomain)
                        }
                        className="mt-1 w-full max-w-[14rem] cursor-pointer appearance-none border-[0.5px] border-slate-400 bg-white py-1.5 pl-0 pr-6 font-code text-sm font-bold text-slate-800 outline-none disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {DOMAIN_OPTIONS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="font-code py-3 pl-0 align-top text-sm text-[#131517]">
                    {row.sealed ? (
                      <span className="font-normal text-[#131517]">[ SEALED ]</span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        {row.verificationRequired ? (
                          <>
                            <span
                              className="inline-block h-2 w-2 shrink-0 bg-[#06B6D4]"
                              aria-hidden
                            />
                            <span className="font-normal text-[#131517]">
                              [ VERIFICATION REQUIRED ]
                            </span>
                          </>
                        ) : (
                          <span className="font-normal text-[#5C6166]">[ READY TO SEAL ]</span>
                        )}
                        <button
                          type="button"
                          onClick={() => sealRecord(row.id)}
                          className="cta-active"
                        >
                          SEAL RECORD
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {inquiryRow ? (
        <div
          className="fixed bottom-0 right-0 z-40 flex flex-wrap items-center gap-x-6 gap-y-2 border-t-[0.5px] border-slate-400 bg-white px-8 py-3"
          style={{ left: "var(--main-with-nav-ml)" }}
        >
          <p className="m-0 flex min-w-0 flex-1 items-baseline gap-2 font-code text-sm leading-snug text-[#131517]">
            <span
              className="mt-1.5 inline-block h-2 w-2 shrink-0 bg-[#06B6D4]"
              aria-hidden
            />
            <span className="min-w-0 truncate" title={inquiryCopy}>
              {inquiryCopy}
            </span>
          </p>
          <button
            type="button"
            onClick={() => sealRecord(inquiryRow.id)}
            className="cta-active shrink-0"
          >
            SEAL RECORD
          </button>
        </div>
      ) : null}
    </div>
  );
}
