export type LedgerDomainTag = "YOU" | "COMPANY" | "WORK";

export type LedgerMount =
  | { kind: "url"; href: string }
  | { kind: "text"; excerpt: string };

export type LedgerAssetDetail = {
  artifactId: string;
  title: string;
  at: string;
  verification: string;
  sealDate: string;
  domain: LedgerDomainTag;
  mount: LedgerMount;
  /** Use **double asterisks** around phrases to render bold impact metrics. */
  forensicAnalysis: string;
  traits: { name: string; delta: string }[];
};

export const LEDGER_ASSETS: LedgerAssetDetail[] = [
  {
    artifactId: "VX-2044",
    title: "Principal ownership · cross-functional launch",
    at: "2025-Q4",
    verification: "Peer + lead",
    sealDate: "2025-11-18",
    domain: "YOU",
    mount: {
      kind: "url",
      href: "https://internal.wiki.example/principal-ownership-launch",
    },
    forensicAnalysis:
      "This attestation locks cross-functional authority for the flagship launch. It underwrites **+18% delivery velocity** against the baseline and **$2.4M** in protected pipeline tied to named executive sponsors. The record is material to succession and scope decisions for the next two quarters.",
    traits: [
      { name: "PACE", delta: "+0.08" },
      { name: "IMPACT", delta: "+0.12" },
      { name: "STANCE", delta: "+0.04" },
    ],
  },
  {
    artifactId: "VX-1981",
    title: "Revenue instrumentation & guardrails",
    at: "2025-Q2",
    verification: "Finance",
    sealDate: "2025-06-02",
    domain: "WORK",
    mount: {
      kind: "text",
      excerpt:
        "Attestation: revenue recognition rules v3 adopted; guardrails enforced on all outbound forecasts. Finance sign-off attached. Effective FY25 Q2 close.",
    },
    forensicAnalysis:
      "Instrumented revenue claims reduce audit drag and accelerate board confidence. The guardrails directly support **99.2% forecast reconciliation** on the last three closes and **−40%** time spent in finance review loops.",
    traits: [
      { name: "PACE", delta: "+0.02" },
      { name: "IMPACT", delta: "+0.15" },
    ],
  },
  {
    artifactId: "VX-1910",
    title: "Technical narrative for executive reviews",
    at: "2024-Q4",
    verification: "Exec staff",
    sealDate: "2024-12-14",
    domain: "COMPANY",
    mount: {
      kind: "url",
      href: "https://docs.corp.example/exec/narrative-fy24q4",
    },
    forensicAnalysis:
      "Positions the product org as the credible narrator for capital allocation. The narrative correlated with **+12 bps** margin narrative lift in staff reviews and **two** accelerated headcount approvals.",
    traits: [
      { name: "STANCE", delta: "+0.10" },
      { name: "IMPACT", delta: "+0.06" },
    ],
  },
];
