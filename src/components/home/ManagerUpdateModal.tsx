"use client";

import { useEffect, useRef, useState } from "react";

// ─── Default content ──────────────────────────────────────────────

export const DEFAULT_UPDATE = {
  subject: "Weekly update - Brian Salay",
  intro:
    "This week was defined by structural hardening. By anchoring the Q3 scope and closing the architecture foundation, I have moved the record from tactical delivery to platform strategy.",
  keyWinsHeader: "Key wins:",
  win1: "· Settled Q3 Roadmap Scope - alignment anchored across 4 teams",
  win2: "· Closed Architecture Epic - H2 scalability foundation sealed",
  win3: "· VP Strategy Review - executive calibration secured on platform vision",
  closing:
    "Next week I am focused on closing the feedback loop and securing budget alignment for H2.",
};

// ─── EditableText ─────────────────────────────────────────────────

function EditableText({
  value,
  onChange,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(value);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing && taRef.current) {
      const ta = taRef.current;
      ta.focus();
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
      ta.selectionStart = ta.selectionEnd = ta.value.length;
    }
  }, [editing]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setDraft(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }

  function save() {
    setEditing(false);
    onChange(draft);
  }

  if (editing) {
    return (
      <textarea
        ref={taRef}
        value={draft}
        onChange={handleChange}
        onBlur={save}
        rows={1}
        style={{
          ...style,
          display: "block",
          width: "100%",
          background: "rgba(0,113,227,0.03)",
          border: "1px solid var(--color-border)",
          borderRadius: 4,
          padding: "2px 6px",
          resize: "none",
          outline: "none",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      />
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => { setDraft(value); setEditing(true); }}
      onKeyDown={(e) => e.key === "Enter" && setEditing(true)}
      style={{
        ...style,
        display: "block",
        cursor: "text",
        padding: "2px 6px",
        marginLeft: -6,
        borderRadius: 4,
        border: "1px solid transparent",
        transition: "border-color 0.12s ease",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--color-border)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}
    >
      {value}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────

const monoLabel: React.CSSProperties = {
  fontFamily: "var(--font-code), ui-monospace, monospace",
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--color-secondary)",
};

export function ManagerUpdateModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState(DEFAULT_UPDATE);
  const [copied, setCopied]   = useState(false);

  function update(key: keyof typeof DEFAULT_UPDATE) {
    return (v: string) => setContent((c) => ({ ...c, [key]: v }));
  }

  function buildText() {
    return [
      content.subject, "",
      content.intro, "",
      content.keyWinsHeader,
      content.win1, content.win2, content.win3, "",
      content.closing,
    ].join("\n");
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(buildText()).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  const bodyStyle: React.CSSProperties = {
    fontFamily: "var(--font-sans)",
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.75,
    color: "var(--color-primary)",
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 70,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "48px 24px",
        overflowY: "auto",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-card)",
          borderRadius: 20,
          width: "100%",
          maxWidth: 680,
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)",
        }}
        role="dialog"
        aria-label="Manager update preview"
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "36px 40px 28px", borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <p className="statement-title m-0">Manager update</p>
            <p className="m-0" style={{ ...monoLabel, marginTop: 4 }}>APR 21-27 // DRAFT</p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onClose}
            style={{ background: "transparent", border: 0, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 300, lineHeight: 1, color: "var(--color-secondary)", padding: "0 0 0 16px", flexShrink: 0 }}
          >
            ×
          </button>
        </div>

        {/* Editable body */}
        <div style={{ padding: "36px 40px", flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <EditableText value={content.subject}        onChange={update("subject")}        style={{ ...bodyStyle, fontWeight: 500, marginBottom: 16 }} />
          <EditableText value={content.intro}          onChange={update("intro")}          style={bodyStyle} />
          <div style={{ height: 12 }} />
          <EditableText value={content.keyWinsHeader}  onChange={update("keyWinsHeader")}  style={{ ...bodyStyle, fontWeight: 500 }} />
          <EditableText value={content.win1}           onChange={update("win1")}           style={bodyStyle} />
          <EditableText value={content.win2}           onChange={update("win2")}           style={bodyStyle} />
          <EditableText value={content.win3}           onChange={update("win3")}           style={bodyStyle} />
          <div style={{ height: 12 }} />
          <EditableText value={content.closing}        onChange={update("closing")}        style={bodyStyle} />
          <p className="text-timestamp m-0" style={{ marginTop: 20 }}>
            Edits are for this message only and do not affect your verified record.
          </p>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 12, padding: "24px 40px 36px", borderTop: "1px solid var(--color-border)" }}>
          <button type="button" className="btn-ghost" onClick={handleCopy} style={{ flex: 1 }}>
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <button
              type="button"
              className="btn-primary"
              disabled
              style={{ width: "100%", cursor: "not-allowed", opacity: 0.4, pointerEvents: "none" }}
            >
              Send via email
            </button>
            <p className="text-timestamp m-0" style={{ textAlign: "center" }}>
              Email integration coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
