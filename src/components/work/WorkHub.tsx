"use client";

import Link from "next/link";
import { SovereignLedger } from "@/components/sovereign/SovereignLedger";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/okrs", label: "OKRs" },
  { href: "/week", label: "Your week" },
  { href: "/performance", label: "Performance" },
] as const;

export function WorkHub() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col gap-4 bg-white text-left">
      <header className="border-b-[0.5px] border-[var(--color-border)] pb-4">
        <p className="m-0 font-ui text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-secondary)]">
          work
        </p>
        <h1 className="font-ui m-0 mt-2 text-[28px] font-semibold leading-tight text-[var(--color-primary)]">
          Delivery and proof
        </h1>
        <p className="font-ui m-0 mt-2 max-w-2xl text-[14px] font-normal leading-relaxed text-[var(--color-secondary)]">
          WORK: Execution graph, OKRs, and weekly load. Tie outcomes to your profile so
          reviews stay evidence-first.
        </p>
      </header>

      <section className="border-[0.5px] border-[var(--color-border)] bg-white p-4">
        <p className="m-0 font-ui text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-secondary)]">
          Status check
        </p>
        <p className="font-ui m-0 mt-3 text-[14px] font-medium leading-snug text-[var(--color-primary)]">
          OKR set published. Two key results lack downstream owners.
        </p>
        <p className="font-ui m-0 mt-2 text-[14px] font-normal leading-snug text-[var(--color-secondary)]">
          Weekly plan shows capacity risk against commit. Reconcile on the work surfaces below.
        </p>
      </section>

      <div>
        <p className="m-0 font-ui text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--color-secondary)]">
          Deepen
        </p>
        <ul className="mt-3 list-none space-y-0 border-[0.5px] border-[var(--color-border)] p-0">
          {LINKS.map((item) => (
            <li key={item.href} className="border-b-[0.5px] border-[var(--color-border)] last:border-b-0">
              <Link
                href={item.href}
                className={cn(
                  "block px-4 py-3 font-ui text-[14px] font-medium text-[var(--color-primary)] outline-none transition-colors",
                  "hover:bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[var(--color-blue)]",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <SovereignLedger domain="WORK" className="mt-auto w-full pt-8" />
    </div>
  );
}
