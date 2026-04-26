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
      <header className="border-b-[0.5px] border-slate-300 pb-4">
        <p className="m-0 font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
          work
        </p>
        <h1 className="font-ui m-0 mt-2 text-[28px] font-semibold leading-tight text-[#131517]">
          Delivery and proof
        </h1>
        <p className="font-ui m-0 mt-2 max-w-2xl text-[14px] font-normal leading-relaxed text-[#5C6166]">
          WORK: Execution graph, OKRs, and weekly load. Tie outcomes to the sovereign record so
          reviews stay evidence-first.
        </p>
      </header>

      <section className="border-[0.5px] border-slate-300 bg-white p-4">
        <p className="m-0 font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
          Status check
        </p>
        <p className="font-ui m-0 mt-3 text-[14px] font-medium leading-snug text-[#131517]">
          OKR set published. Two key results lack downstream owners.
        </p>
        <p className="font-ui m-0 mt-2 text-[14px] font-normal leading-snug text-[#5C6166]">
          Weekly plan shows capacity risk against commit. Reconcile on the work surfaces below.
        </p>
      </section>

      <div>
        <p className="m-0 font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
          Deepen
        </p>
        <ul className="mt-3 list-none space-y-0 border-[0.5px] border-slate-300 p-0">
          {LINKS.map((item) => (
            <li key={item.href} className="border-b-[0.5px] border-slate-300 last:border-b-0">
              <Link
                href={item.href}
                className={cn(
                  "block px-4 py-3 font-ui text-[14px] font-medium text-[#131517] outline-none transition-colors",
                  "hover:bg-[#F8FAFC] focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#06B6D4]",
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
