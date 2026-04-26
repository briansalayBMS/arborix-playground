"use client";

import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { cn } from "@/lib/cn";

type MountedArtifact = {
  id: string;
  name: string;
};

function isPdf(file: File): boolean {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return true;
  const t = file.type.toLowerCase();
  return (
    t === "application/pdf" ||
    t === "application/x-pdf" ||
    t === "application/acrobat" ||
    t === "applications/vnd.pdf"
  );
}

function addPdfArtifacts(
  prev: MountedArtifact[],
  files: File[],
): MountedArtifact[] {
  const seen = new Set(prev.map((a) => a.name));
  const next = [...prev];
  for (const f of files) {
    if (!isPdf(f)) continue;
    if (seen.has(f.name)) continue;
    seen.add(f.name);
    next.push({
      id: `artifact-${f.name}-${next.length}`,
      name: f.name,
    });
  }
  return next;
}

export function WelcomeDeposit() {
  const router = useRouter();
  const fileInputId = useId();
  const nameId = useId();
  const emailId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [artifacts, setArtifacts] = useState<MountedArtifact[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const emailValid = /\S+@\S+\.\S+/.test(email.trim());
  const canInitiate =
    name.trim().length > 0 && email.trim().length > 0 && emailValid && artifacts.length > 0;

  const ingestFiles = useCallback((fileList: FileList | null) => {
    if (!fileList?.length) return;
    setArtifacts((prev) => addPdfArtifacts(prev, Array.from(fileList)));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      ingestFiles(e.dataTransfer.files);
    },
    [ingestFiles],
  );

  const onDragOverZone = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDragOver(true);
  }, []);

  const onDragLeaveZone = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  }, []);

  const onIngest = useCallback(() => {
    if (!canInitiate) return;
    router.push("/you");
  }, [canInitiate, router]);

  return (
    <section className="w-full">
      <header className="border-b-[0.5px] border-slate-300 pb-6">
        <h1 className="font-ui m-0 text-[32px] font-semibold leading-tight text-[#131517]">
          Mount Your Record
        </h1>
        <p className="font-ui m-0 mt-3 text-[16px] font-normal leading-relaxed text-[#5C6166]">
          Upload your LinkedIn PDF or Resume to begin the forensic audit.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor={nameId}
              className="font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]"
            >
              FULL NAME
            </label>
            <input
              id={nameId}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              autoComplete="name"
              className="h-10 rounded-none border-[0.5px] border-slate-400 bg-white px-3 font-code text-[14px] text-[#131517] outline-none placeholder:text-[#5C6166]/45 focus:border-[#06B6D4]/60"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor={emailId}
              className="font-code text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]"
            >
              BUSINESS EMAIL
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              required
              autoComplete="email"
              className="h-10 rounded-none border-[0.5px] border-slate-400 bg-white px-3 font-code text-[14px] text-[#131517] outline-none placeholder:text-[#5C6166]/45 focus:border-[#06B6D4]/60"
            />
          </div>
        </div>

        <div
          className={cn(
            "relative mt-2 min-h-[140px] rounded-none border-[0.5px] border-slate-400 bg-white p-6 text-left transition-colors",
            dragOver && "border-[#06B6D4]/60 bg-[#E0F5FF]/30",
          )}
          onDragOver={onDragOverZone}
          onDragLeave={onDragLeaveZone}
          onDrop={onDrop}
        >
          <div className="pointer-events-none relative z-0">
            <p className="font-code m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#131517]">
              [ MOUNT PROFESSIONAL RECORD ]
            </p>
            <p className="font-code m-0 mt-2 text-[14px] leading-relaxed text-[#5C6166]">
              Drop LinkedIn export PDF and resume PDF here, or click to add files. You can mount
              multiple sources.
            </p>
          </div>
          <input
            id={fileInputId}
            type="file"
            accept=".pdf,application/pdf,application/x-pdf"
            multiple
            aria-label="Choose PDF files to mount"
            className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "copy";
              setDragOver(true);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              ingestFiles(e.dataTransfer.files);
            }}
            onChange={(e) => {
              ingestFiles(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        {artifacts.length > 0 ? (
          <div className="mt-2 border-[0.5px] border-slate-300 bg-white p-4">
            <p className="font-code m-0 text-[12px] font-medium uppercase tracking-[0.12em] text-[#5C6166]">
              Mounted Artifacts
            </p>
            <p className="font-code m-0 mt-2 flex flex-wrap items-baseline gap-x-1 gap-y-1 text-[12px] leading-relaxed text-[#131517]">
              {artifacts.map((a, i) => (
                <span key={a.id} className="inline-flex items-baseline gap-1">
                  {i > 0 ? (
                    <span className="text-[#5C6166]" aria-hidden>
                      |
                    </span>
                  ) : null}
                  <span>[ SOURCE: {a.name} ]</span>
                </span>
              ))}
            </p>
          </div>
        ) : null}

        <div className="mt-2">
          <button
            type="button"
            onClick={onIngest}
            disabled={!canInitiate}
            className="cta-active disabled:cursor-not-allowed disabled:opacity-45"
          >
            [ INITIATE FORENSIC AUDIT ]
          </button>
        </div>
      </div>
    </section>
  );
}
