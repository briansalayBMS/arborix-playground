import { AppShell } from "@/components/layout/AppShell";

export default function LegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
