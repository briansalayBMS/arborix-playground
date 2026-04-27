"use client";

import { cn } from "@/lib/cn";
import type { RedactionRange } from "@/lib/proofRedaction";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

type Props = {
  value: string;
  redactions: RedactionRange[];
  onRedact: (range: RedactionRange) => void;
  className?: string;
};

function renderRedactedSegments(text: string, ranges: RedactionRange[]) {
  const sorted = [...ranges].sort((a, b) => a.start - b.start);
  const out: ReactNode[] = [];
  let pos = 0;
  let key = 0;
  for (const r of sorted) {
    if (r.start > pos) {
      out.push(<span key={key++}>{text.slice(pos, r.start)}</span>);
    }
    const len = r.end - r.start;
    out.push(
      <span
        key={key++}
        className="inline-block rounded-none bg-[var(--color-primary)] align-baseline font-code text-sm leading-relaxed text-transparent select-none"
        aria-hidden
      >
        {"\u00A0".repeat(len)}
      </span>,
    );
    pos = r.end;
  }
  if (pos < text.length) {
    out.push(<span key={key++}>{text.slice(pos)}</span>);
  }
  return out.length > 0 ? out : [<span key={0}>{text}</span>];
}

export function RedactableSourceText({
  value,
  redactions,
  onRedact,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [float, setFloat] = useState<{ left: number; top: number } | null>(null);
  const [pending, setPending] = useState<RedactionRange | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !ref.current) {
      setFloat(null);
      setPending(null);
      return;
    }
    const range = sel.getRangeAt(0);
    if (!ref.current.contains(range.commonAncestorContainer)) {
      setFloat(null);
      setPending(null);
      return;
    }
    const pre = range.cloneRange();
    pre.selectNodeContents(ref.current);
    pre.setEnd(range.startContainer, range.startOffset);
    const start = pre.toString().length;
    const end = start + range.toString().length;
    if (start >= end) {
      setFloat(null);
      setPending(null);
      return;
    }
    setPending({ start, end });
    const rect = range.getBoundingClientRect();
    setFloat({ left: rect.left, top: rect.bottom + 4 });
  }, []);

  const applyRedact = useCallback(() => {
    if (!pending) return;
    onRedact(pending);
    setFloat(null);
    setPending(null);
    window.getSelection()?.removeAllRanges();
  }, [pending, onRedact]);

  useLayoutEffect(() => {
    if (!float) return;
    const hide = () => {
      setFloat(null);
      setPending(null);
    };
    window.addEventListener("scroll", hide, true);
    return () => window.removeEventListener("scroll", hide, true);
  }, [float]);

  return (
    <>
      <div
        ref={ref}
        onMouseUp={onMouseUp}
        className={cn(
          "select-text font-code text-sm whitespace-pre-wrap text-[var(--color-primary)]",
          className,
        )}
      >
        {renderRedactedSegments(value, redactions)}
      </div>
      {mounted &&
        float &&
        pending &&
        createPortal(
          <button
            type="button"
            className="fixed z-[100] border-[0.5px] border-[var(--color-secondary)] bg-white px-2 py-1 font-code text-[12px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]"
            style={{ left: float.left, top: float.top }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={applyRedact}
          >
            [ REDACT ]
          </button>,
          document.body,
        )}
    </>
  );
}
