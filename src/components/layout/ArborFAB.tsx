"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

// ─── Observations ────────────────────────────────────────────────

const OBSERVATIONS = [
  "How are you feeling? You've been busy today.",
  "Looks like a lot to do today. I can help you prioritize.",
  "How can I help you?",
];

function pickObservation(pathname: string): string {
  if (pathname === "/home") return OBSERVATIONS[0];
  if (pathname === "/you") return OBSERVATIONS[1];
  return OBSERVATIONS[2];
}

// ─── FAB ─────────────────────────────────────────────────────────

export function ArborFAB() {
  const pathname = usePathname();
  const observation = pickObservation(pathname);
  const drawerObs = "You've been busy today. How can I help?";

  const [hovered, setHovered] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "arbor" | "user"; text: string }>>([
    { role: "arbor", text: drawerObs },
  ]);

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "arbor", text: "I'm reviewing your ledger now. Give me a moment." },
    ]);
    setInput("");
  }

  const shouldBreathe = !hovered && !drawerOpen;

  return (
    <>
      {/* FAB */}
      <motion.button
        type="button"
        aria-label="Open Arbor assistant"
        layout
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => {
          setHovered(false);
          setDrawerOpen(true);
        }}
        animate={shouldBreathe ? { scale: [1, 1.03, 1] } : { scale: 1 }}
        transition={
          shouldBreathe
            ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.15 }
        }
        style={{
          position: "fixed",
          bottom: 80,
          right: 32,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          gap: hovered ? 10 : 0,
          height: 44,
          minWidth: 44,
          borderRadius: 22,
          background: "var(--color-primary)",
          border: 0,
          cursor: "pointer",
          padding: hovered ? "0 18px 0 14px" : "0 0 0 0",
          overflow: "hidden",
          justifyContent: "center",
        }}
      >
        {/* "A" mark — always visible */}
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

        {/* Observation pill text — appears on hover */}
        <AnimatePresence>
          {hovered && (
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
        </AnimatePresence>
      </motion.button>

      {/* Dialogue drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            key="drawer"
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
            {/* Drawer header */}
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
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "var(--color-primary)",
                }}
              >
                Arbor
              </span>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: "transparent",
                  border: 0,
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
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
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "12px 16px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
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
            <div
              style={{
                display: "flex",
                gap: 8,
                padding: "10px 12px",
                borderTop: "1px solid var(--color-border)",
                flexShrink: 0,
              }}
            >
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
                  fontSize: 11,
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
    </>
  );
}
