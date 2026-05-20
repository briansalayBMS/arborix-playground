"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./ChatBar.module.css";

interface Message {
  role: "arbor" | "user";
  text: string;
}

export default function ChatBar() {
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "arbor", text: "Hi there. How can I help you today?" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isExpanded && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isExpanded]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSend();
      } else if (!isExpanded) {
        setIsExpanded(true);
      }
    }
    if (e.key === "Escape" && isExpanded) {
      setIsExpanded(false);
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Expand if not already
    if (!isExpanded) {
      setIsExpanded(true);
    }

    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
    ]);
    setInput("");

    // Simulate Arbor response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "arbor", text: "I'm reviewing your request. Give me a moment to synthesize a response." },
      ]);
    }, 800);
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  return (
    <>
      {/* Glass overlay panel that slides up */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={styles.chatPanel}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>Arbor</span>
              <button
                type="button"
                className={styles.closeButton}
                onClick={handleClose}
                aria-label="Close chat"
              >
                Close
              </button>
            </div>

            {/* Messages area */}
            <div className={styles.messagesArea}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user"
                      ? styles.userMessage
                      : styles.arborMessage
                  }
                >
                  <span className={styles.messageText}>{msg.text}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent chat bar at bottom */}
      <div className={styles.chatBar}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Arbor anything..."
            className={styles.input}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim()}
            className={styles.sendButton}
            aria-label="Send message"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
