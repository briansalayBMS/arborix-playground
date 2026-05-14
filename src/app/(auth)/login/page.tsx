"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      await supabase.auth.getSession();
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError("Something took too long. Please try again.");
    }, 8000);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      clearTimeout(timeoutId);

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("Check your email to confirm your account, then sign in.");
        setLoading(false);
        return;
      }

      router.push("/welcome");
    } catch (err) {
      clearTimeout(timeoutId);
      setError(err instanceof Error ? err.message : "Sign up failed");
      setLoading(false);
    }
  };

  const onSubmit = isSignUp ? handleSignUp : handleSignIn;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "var(--color-background)",
        padding: "var(--spacing-4x)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-12x)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center" }}>
          <Image
            src="/arborix-logo.png"
            alt="Arborix"
            width={40}
            height={48}
            priority
            style={{ height: "auto", width: "auto", display: "inline-block" }}
          />
        </div>

        {/* Card */}
        <div
          className="arb-card-standard"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-8x)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 24,
              fontWeight: 400,
              color: "var(--color-primary)",
              fontFamily: "var(--font-serif)",
            }}
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </h2>

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6x)" }}>
            {/* Email Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2x)" }}>
              <label
                htmlFor="email"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--color-secondary)",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={loading}
                style={{
                  height: 40,
                  padding: "0 var(--spacing-3x)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  border: "0.5px solid var(--color-border)",
                  borderRadius: 0,
                  backgroundColor: "white",
                  color: "var(--color-primary)",
                  outline: "none",
                }}
              />
            </div>

            {/* Password Input */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-2x)" }}>
              <label
                htmlFor="password"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "var(--color-secondary)",
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                style={{
                  height: 40,
                  padding: "0 var(--spacing-3x)",
                  fontFamily: "var(--font-sans)",
                  fontSize: 14,
                  border: "0.5px solid var(--color-border)",
                  borderRadius: 0,
                  backgroundColor: "white",
                  color: "var(--color-primary)",
                  outline: "none",
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--color-conflict)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                height: 40,
                padding: "0 var(--spacing-6x)",
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--color-primary)",
                backgroundColor: "white",
                border: "0.5px solid var(--color-border)",
                borderRadius: 0,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          {/* Toggle */}
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                color: "var(--color-secondary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--color-blue)",
                  fontSize: 14,
                  fontFamily: "var(--font-sans)",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
