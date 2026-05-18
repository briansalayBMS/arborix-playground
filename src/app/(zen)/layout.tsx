"use client";

import SideNav from "@/components/side-nav/SideNav";
import RightPane from "@/components/right-pane/RightPane";
import RightPaneTrigger from "@/components/right-pane/RightPaneTrigger";
import { RightPaneProvider, useRightPane } from "@/context/RightPaneContext";
import { DiagnosticFocusProvider } from "@/context/DiagnosticFocusContext";
import styles from "./zen-layout.module.css";

function ZenLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, context, close, openWithContext } = useRightPane();

  return (
    <>
      <SideNav />
      <div className={styles.frame}>
        <div className={styles.column}>
          {children}
        </div>
      </div>
      <RightPaneTrigger onClick={() => openWithContext({
        type: "chat",
        subject: "Start a conversation",
        placeholder: "Chat interface will load here once backend is wired."
      })} />
      <RightPane
        isOpen={isOpen}
        onClose={close}
        context={context}
      />
    </>
  );
}

export default function ZenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DiagnosticFocusProvider>
      <RightPaneProvider>
        <ZenLayoutContent>{children}</ZenLayoutContent>
      </RightPaneProvider>
    </DiagnosticFocusProvider>
  );
}
