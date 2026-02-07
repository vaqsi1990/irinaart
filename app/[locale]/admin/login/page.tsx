"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get("from") || "/admin";
  // Avoid redirecting back to login after successful auth
  const from = rawFrom.includes("/admin/login") ? "/admin" : rawFrom;
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Invalid password");
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">პანელი</h1>
        <p className="admin-login__hint">შეიყვანეთ პაროლი</p>
        <form onSubmit={handleSubmit} className="admin-login__form">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="პაროლი"
            className="admin-login__input"
            autoFocus
            autoComplete="current-password"
            disabled={loading}
          />
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="siteNav__link" disabled={loading}>
            {loading ? "..." : "შესვლა"}
          </button>
        </form>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1 className="admin-login__title">პანელი</h1>
        <p className="admin-login__hint">შეიყვანეთ პაროლი</p>
        <div className="admin-login__form">
          <div className="admin-login__input" style={{ color: "#94a3b8" }}>
            იტვირთება...
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
