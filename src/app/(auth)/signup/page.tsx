"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AuthShell from "@/components/auth-shell/AuthShell";
import styles from "./page.module.css";

function Field({
  label,
  id,
  type,
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled: boolean;
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required
        className={styles.input}
      />
    </div>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <AuthShell
      heading="Create your account"
      footer={
        <a href="/login" style={{ color: "inherit", textDecoration: "none" }}>
          Already have an account?{" "}
          <span
            style={{
              textDecoration: "underline",
              textDecorationColor: "transparent",
              transitionProperty: "text-decoration-color",
              transitionDuration: "var(--duration-quick)",
              transitionTimingFunction: "var(--ease-standard)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textDecorationColor =
                "var(--color-action-default)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textDecorationColor = "transparent";
            }}
          >
            Sign in →
          </span>
        </a>
      }
    >
      <form onSubmit={handleSignUp} className={styles.form}>
        <Field
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          disabled={loading}
        />

        <Field
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          disabled={loading}
        />

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
