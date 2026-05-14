import type { Metadata } from "next";
import { Public_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import "@/styles/arborix-ds.css";
import { DepositionOverlay } from "@/components/deposition/DepositionOverlay";
import { PersonalityHookOverlay } from "@/components/personality/PersonalityHookOverlay";
import { IngestLedgerProvider } from "@/components/providers/IngestLedgerProvider";
import { DemoFirstTimeProvider } from "@/context/DemoFirstTimeContext";
import { SovereignCommandProvider } from "@/context/SovereignCommandContext";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arborix",
  description: "High-status career performance",
};

if (typeof process !== 'undefined') {
  console.log('[Arborix] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL || 'not set (will default to http://localhost:8000)')
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen font-[family-name:var(--font-sans)]">
        <IngestLedgerProvider>
          <SovereignCommandProvider>
            <DemoFirstTimeProvider>
              <PersonalityHookOverlay />
              <DepositionOverlay />
              {children}
            </DemoFirstTimeProvider>
          </SovereignCommandProvider>
        </IngestLedgerProvider>
      </body>
    </html>
  );
}
