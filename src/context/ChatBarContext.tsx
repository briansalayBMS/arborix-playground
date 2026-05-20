"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface ChatContext {
  type: "chat" | "continuity" | "sources";
  subject?: string;
  placeholder?: string;
  sources?: Array<{
    id: string;
    type: string;
    title: string;
    excerpt: string;
  }>;
  sourceNoun?: string;
  povId?: string;
  povType?: string;
}

interface ChatBarContextValue {
  isExpanded: boolean;
  context: ChatContext | null;
  expand: () => void;
  collapse: () => void;
  openWithContext: (ctx: ChatContext) => void;
  sendMessage: (message: string) => void;
  messages: Array<{ role: "user" | "arbor"; content: string }>;
}

const ChatBarContext = createContext<ChatBarContextValue | null>(null);

export function ChatBarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [context, setContext] = useState<ChatContext | null>(null);
  const [messages, setMessages] = useState<Array<{ role: "user" | "arbor"; content: string }>>([]);

  const expand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const openWithContext = useCallback((ctx: ChatContext) => {
    setContext(ctx);
    setIsExpanded(true);
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (!message.trim()) return;
    
    setMessages((prev) => [
      ...prev,
      { role: "user", content: message },
    ]);

    // Simulated response - will be replaced with actual backend
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "arbor", content: "I hear you. Let me think about that..." },
      ]);
    }, 800);
  }, []);

  return (
    <ChatBarContext.Provider
      value={{
        isExpanded,
        context,
        expand,
        collapse,
        openWithContext,
        sendMessage,
        messages,
      }}
    >
      {children}
    </ChatBarContext.Provider>
  );
}

export function useChatBar() {
  const context = useContext(ChatBarContext);
  if (!context) {
    throw new Error("useChatBar must be used within ChatBarProvider");
  }
  return context;
}
