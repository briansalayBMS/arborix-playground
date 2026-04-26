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
      <h2 className="font-ui m-0 text-sm font-bold tracking-tight text-[#131517]">{title}</h2>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b-[0.5px] border-slate-400">
              <th
                scope="col"
                className="font-code py-3 pr-4 text-[12px] font-bold uppercase tracking-widest text-[#5C6166]"
              >
                Artifact ID
              </th>
              <th
                scope="col"
                className="font-code py-3 pr-4 text-[12px] font-bold uppercase tracking-widest text-[#5C6166]"
              >
                Source
              </th>
              <th
                scope="col"
                className="font-code py-3 pr-4 text-[12px] font-bold uppercase tracking-widest text-[#5C6166]"
              >
                Type (AUTO)
              </th>
              <th
                scope="col"
                className="font-code py-3 text-[12px] font-bold uppercase tracking-widest text-[#5C6166]"
              >
                Custody
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b-[0.5px] border-slate-400">
                <td className="font-code py-3 pr-4 align-top text-sm font-normal text-[#131517]">
                  {row.id}
                </td>
                <td className="font-code max-w-[320px] py-3 pr-4 align-top text-sm font-normal text-[#131517]">
                  {row.source}
                </td>
                <td className="font-code py-3 pr-4 align-top text-sm font-normal text-[#131517]">
                  {row.type}
                </td>
                <td className="font-code py-3 align-top text-sm font-bold text-[#131517]">
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
