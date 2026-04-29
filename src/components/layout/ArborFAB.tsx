"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Synthesis content (Task 1) ───────────────────────────────────

const SYNTHESIS = {
  title: "Your Weekly Strategic Synthesis",
  body:  "This week, I shifted the narrative from feature delivery to strategic alignment. Key wins include settling the Q3 Roadmap scope and hardening the architecture epic. I have framed these for your manager as Foundational Scalability rather than tactical closures.",
};

// ─── Observations ────────────────────────────────────────────────

function pickObservation(pathname: string): string {
  if (pathname === "/home") return "You've been busy today. How are you feeling?";
  if (pathname === "/you")  return "Looks like a lot to do today. I can help you prioritize.";
  return "How can I help you?";
}

// ─── FAB ─────────────────────────────────────────────────────────

export function ArborFAB({ viewMode = "internal" }: { viewMode?: "internal" | "external" }) {
  const pathname    = usePathname();
  const observation = pickObservation(pathname);
  const hidden      = viewMode === "external";

  const [hovered,     setHovered]     = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [thinking,    setThinking]    = useState(false);
  const [showSynth,   setShowSynth]   = useState(false);
  const [input,       setInput]       = useState("");
  const [messages,    setMessages]    = useState<Array<{ role: "arbor" | "user"; text: string }>>([
    { role: "arbor", text: "You've been busy today. How can I help?" },
  ]);

  const thinkingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Listen for weekly update trigger from Home page
  useEffect(() => {
    function handleWeeklyUpdate() {
      // Close any open drawer first, reset to synth mode
      setDrawerOpen(false);
      setShowSynth(false);
      setThinking(true);

      thinkingTimer.current = setTimeout(() => {
        setThinking(false);
        setShowSynth(true);
        setDrawerOpen(true);
      }, 1500);
    }

    document.addEventListener("arborix:draft-weekly-update", handleWeeklyUpdate);
    return () => {
      document.removeEventListener("arborix:draft-weekly-update", handleWeeklyUpdate);
      if (thinkingTimer.current) clearTimeout(thinkingTimer.current);
    };
  }, []);

  function handleClose() {
    setDrawerOpen(false);
    setShowSynth(false);
  }

  function handleFABClick() {
    setHovered(false);
    setShowSynth(false);
    setDrawerOpen(true);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: "user",  text: trimmed },
      { role: "arbor", text: "I'm reviewing your ledger now. Give me a moment." },
    ]);
    setInput("");
  }

  const shouldBreathe = !hovered && !drawerOpen && !thinking;

  const fabAnimate = thinking
    ? { scale: [1, 1.12, 0.94, 1.08, 1], opacity: [1, 0.7, 1, 0.75, 1] }
    : shouldBreathe
      ? { scale: [1, 1.03, 1] }
      : { scale: 1 };

  const fabTransition = thinking
    ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" as const }
    : shouldBreathe
      ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 0.15 };

  return (
    <div style={hidden ? { visibility: "hidden", pointerEvents: "none" } : undefined}>
      {/* FAB */}
      <motion.button
        type="button"
        aria-label="Open Arbor assistant"
        layout
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={handleFABClick}
        animate={fabAnimate}
        transition={fabTransition}
        style={{
          position: "fixed",
          bottom: 'calc(40px + 16px)',
          right: 32,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: hovered ? 10 : 0,
          height: 44,
          minWidth: 44,
          borderRadius: 22,
          background: thinking ? "var(--color-blue)" : "var(--color-primary)",
          border: 0,
          cursor: "pointer",
          padding: hovered ? "0 18px 0 14px" : "0 0 0 0",
          overflow: "hidden",
          justifyContent: "center",
          transition: "background 0.3s ease",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 17,
            fontWeight: 400,
            color: "var(--color-card)",
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          A
        </span>

        <AnimatePresence>
          {hovered && !thinking && (
            <motion.span
              key="obs"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 14,
                fontWeight: 400,
                color: "var(--color-card)",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {observation}
            </motion.span>
          )}
          {thinking && (
            <motion.span
              key="thinking"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 13,
                fontWeight: 400,
                color: "var(--color-card)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                paddingRight: 14,
              }}
            >
              Synthesizing...
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* ── Synthesis drawer ─────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && showSynth && (
          <motion.div
            key="synth-drawer"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              bottom: 40,
              right: 0,
              zIndex: 45,
              width: "100%",
              maxWidth: 480,
              background: "var(--color-card)",
              borderRadius: "20px 20px 0 0",
              boxShadow: "0 -4px 32px rgba(0,0,0,0.08)",
              padding: 32,
            }}
            role="dialog"
            aria-label="Weekly strategic synthesis"
          >
            {/* Dismiss handle */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <p
                className="m-0"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "var(--color-secondary)",
                }}
              >
                {SYNTHESIS.title}
              </p>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={handleClose}
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-secondary)",
                  padding: 0,
                  flexShrink: 0,
                  marginLeft: 16,
                }}
              >
                Dismiss
              </button>
            </div>

            <p
              className="m-0"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 18,
                fontWeight: 300,
                lineHeight: 1.75,
                color: "var(--color-primary)",
              }}
            >
              {SYNTHESIS.body}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Chat drawer ──────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && !showSynth && (
          <motion.div
            key="chat-drawer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              bottom: 136,
              right: 32,
              zIndex: 45,
              width: 320,
              maxHeight: 420,
              display: "flex",
              flexDirection: "column",
              background: "var(--color-card)",
              border: "1px solid var(--color-border)",
              borderRadius: 16,
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              overflow: "hidden",
            }}
            role="dialog"
            aria-label="Arbor assistant"
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderBottom: "1px solid var(--color-border)",
                flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 14, fontWeight: 400, color: "var(--color-primary)" }}>
                Arbor
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={handleClose}
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-secondary)",
                  padding: 0,
                }}
              >
                Close
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: 13,
                      fontWeight: 300,
                      lineHeight: 1.55,
                      color: msg.role === "user" ? "var(--color-card)" : "var(--color-primary)",
                      background: msg.role === "user" ? "var(--color-primary)" : "var(--color-bg)",
                      borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      padding: "8px 12px",
                      maxWidth: "85%",
                    }}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderTop: "1px solid var(--color-border)", flexShrink: 0 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Reply..."
                style={{
                  flex: 1,
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  fontWeight: 300,
                  color: "var(--color-primary)",
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  padding: "7px 10px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={handleSend}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-card)",
                  background: "var(--color-primary)",
                  border: 0,
                  borderRadius: 8,
                  padding: "7px 12px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
