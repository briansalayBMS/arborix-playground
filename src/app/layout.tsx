import type { Metadata } from "next";
import { Inter, Source_Code_Pro, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "@/styles/tokens.css";
import "@/styles/arborix-ds.css";
import { AppShell } from "@/components/layout/AppShell";
import { DepositionOverlay } from "@/components/deposition/DepositionOverlay";
import { PersonalityHookOverlay } from "@/components/personality/PersonalityHookOverlay";
import { IngestLedgerProvider } from "@/components/providers/IngestLedgerProvider";
import { DemoFirstTimeProvider } from "@/context/DemoFirstTimeContext";
import { SovereignCommandProvider } from "@/context/SovereignCommandContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
});

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Arborix",
  description: "High-status career performance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sourceCodePro.variable} ${instrumentSerif.variable}`}
    >
      <body className="min-h-screen font-[family-name:var(--font-sans)]">
        <IngestLedgerProvider>
          <SovereignCommandProvider>
            <DemoFirstTimeProvider>
              <PersonalityHookOverlay />
              <DepositionOverlay />
              <AppShell>{children}</AppShell>
            </DemoFirstTimeProvider>
          </SovereignCommandProvider>
        </IngestLedgerProvider>
      </body>
    </html>
  );
}
