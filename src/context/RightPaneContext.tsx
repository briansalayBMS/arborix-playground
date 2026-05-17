"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { RightPaneContext as RightPaneContextType } from "@/components/right-pane/RightPane";

interface RightPaneContextValue {
  isOpen: boolean;
  context?: RightPaneContextType;
  openWithContext: (context: RightPaneContextType) => void;
  close: () => void;
}

const RightPaneContext = createContext<RightPaneContextValue | undefined>(
  undefined
);

export function RightPaneProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState<RightPaneContextType>();

  const openWithContext = (newContext: RightPaneContextType) => {
    setContext(newContext);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <RightPaneContext.Provider value={{ isOpen, context, openWithContext, close }}>
      {children}
    </RightPaneContext.Provider>
  );
}

export function useRightPane() {
  const context = useContext(RightPaneContext);
  if (!context) {
    throw new Error("useRightPane must be used within RightPaneProvider");
  }
  return context;
}
