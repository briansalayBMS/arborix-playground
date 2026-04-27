"use client";

import { useIngestLedger } from "@/components/providers/IngestLedgerProvider";
import type { LedgerDomain } from "@/lib/ingestLedger";

type Props = {
  domain: LedgerDomain;
  title?: string;
};

export function SealedArtifactsPanel({
  domain,
  title = "Sealed intake stream",
}: Props) {
  const { sealedFor } = useIngestLedger();
  const rows = sealedFor(domain);

  if (rows.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="font-ui m-0 text-sm font-bold tracking-tight text-[var(--color-primary)]">{title}</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b-[0.5px] border-[var(--color-secondary)]">
              <th
                scope="col"
                className="font-code py-3 pr-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-secondary)]"
              >
                Artifact ID
              </th>
              <th
                scope="col"
                className="font-code py-3 pr-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-secondary)]"
              >
                Source
              </th>
              <th
                scope="col"
                className="font-code py-3 pr-4 text-[12px] font-bold uppercase tracking-widest text-[var(--color-secondary)]"
              >
                Type (AUTO)
              </th>
              <th
                scope="col"
                className="font-code py-3 text-[12px] font-bold uppercase tracking-widest text-[var(--color-secondary)]"
              >
                Custody
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b-[0.5px] border-[var(--color-secondary)]">
                <td className="font-code py-3 pr-4 align-top text-sm font-normal text-[var(--color-primary)]">
                  {row.id}
                </td>
                <td className="font-code max-w-[320px] py-3 pr-4 align-top text-sm font-normal text-[var(--color-primary)]">
                  {row.source}
                </td>
                <td className="font-code py-3 pr-4 align-top text-sm font-normal text-[var(--color-primary)]">
                  {row.type}
                </td>
                <td className="font-code py-3 align-top text-sm font-bold text-[var(--color-primary)]">
                  [ SEALED ]
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
