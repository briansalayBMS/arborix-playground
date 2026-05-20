"use client";

import SideNav from "@/components/side-nav/SideNav";
import ChatBar from "@/components/chat-bar/ChatBar";
import { DiagnosticFocusProvider } from "@/context/DiagnosticFocusContext";
import { UserProvider } from "@/context/UserContext";
import { LedgerProvider } from "@/context/LedgerContext";
import styles from "./zen-layout.module.css";

function ZenLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SideNav />
      <div className={styles.frame}>
        <div className={styles.column}>
          {children}
        </div>
      </div>
      <ChatBar />
    </>
  );
}

export default function ZenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <LedgerProvider>
        <DiagnosticFocusProvider>
          <ZenLayoutContent>{children}</ZenLayoutContent>
        </DiagnosticFocusProvider>
      </LedgerProvider>
    </UserProvider>
  );
}
