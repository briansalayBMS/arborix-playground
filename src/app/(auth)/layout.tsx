import AuthTopBar from "@/components/auth-top-bar/AuthTopBar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthTopBar />
      {children}
    </>
  );
}
