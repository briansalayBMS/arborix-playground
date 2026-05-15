"use client";

import { useState } from "react";
import SideNav from "@/components/side-nav/SideNav";
import RightPane from "@/components/right-pane/RightPane";
import RightPaneTrigger from "@/components/right-pane/RightPaneTrigger";
import styles from "./zen-layout.module.css";

export default function ZenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rightPaneOpen, setRightPaneOpen] = useState(false);

  return (
    <>
      <SideNav />
      <div className={styles.frame}>
        <div className={styles.column}>
          {children}
        </div>
      </div>
      <RightPaneTrigger onClick={() => setRightPaneOpen(true)} />
      <RightPane
        isOpen={rightPaneOpen}
        onClose={() => setRightPaneOpen(false)}
      />
    </>
  );
}
