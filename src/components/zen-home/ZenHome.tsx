"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./ZenHome.module.css";
import HomeWelcome from "@/components/whats-in-play/HomeWelcome";
import WhatsInPlayItem from "@/components/whats-in-play/WhatsInPlayItem";

/**
 * Navigation destinations for each interactive affordance on HOME.
 * Each destination describes where the affordance leads and what context is pre-loaded.
 */
const LINK_DESTINATIONS = {
  pickBackUp: {
    destination: "rightPane",
    context: "continuity",
    description: "Opens right pane pre-loaded with continuity context from last conversation",
  },
  povActionObservation: {
    destination: "rightPane",
    context: "chat",
    description: "Opens right pane with chat context to explore this observation together",
  },
  povActionConflict: {
    destination: "rightPane",
    context: "chat",
    description: "Opens right pane with chat context to dig into this conflict pattern",
  },
  povActionPartialRead: {
    destination: "rightPane",
    context: "chat",
    description: "Opens right pane with chat context to sharpen this personality read",
  },
  povAttribution: {
    destination: "rightPane",
    context: "evidence",
    description: "Opens right pane showing evidence details for this POV",
  },
  completenessLink: {
    destination: "navigate",
    href: "/your-record",
    description: "Navigate to YOUR domain to view full record and profile completion details",
  },
} as const;

export default function ZenHome() {
  return (
    <main className={styles.main}>
      <div className={styles.section}>
        <HomeWelcome />
      </div>

      <div className={styles.itemsSection}>
        <WhatsInPlayItem
          type="observation"
          pov="You describe your work in third person more than you realize. Worth looking at what that protects."
          attribution="Based on 3 resume passages"
          action="Let's look at this together →"
        />

        <WhatsInPlayItem
          type="conflict"
          pov="You said you want a Director role. The pattern in your last three quarters is avoiding cross-functional rooms. The two do not fit yet."
          attribution="Drawn from your goal and 6 quarterly observations"
          action="Let me push on this with you →"
        />

        <WhatsInPlayItem
          type="partial-read"
          pov="My read on your operating style is Strategic Driver. It would sharpen considerably with the personality questions."
          attribution="Based on 5 resume rows"
          action="Give me ten minutes and I'll sharpen this →"
        />
      </div>

      <div className={styles.section}>
        <div className={styles.recordLink}>
          Profile is 42% complete.{" "}
          <Link href="/your-record" className={styles.recordLinkAction}>
            View your{" "}
            <span className={styles.nowrapAction}>
              record
              <ArrowRight size={14} strokeWidth={1.5} className={styles.recordLinkArrow} />
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
