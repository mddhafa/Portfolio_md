"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      router.push("/admin/projects");
    } catch {
      setError("Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "24px",
    }}>
      <div style={{
        width: "100%",
        maxWidth: "400px",
        animation: "scaleIn 0.4s ease-out",
      }}>
        {/* Header */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <div style={{
            width: 48, height: 48,
            background: "var(--text)",
            borderRadius: "12px",
            margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: "22px", fontWeight: 800,
            letterSpacing: "-0.5px",
            color: "var(--text)",
          }}>Admin Panel</h1>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: 6 }}>
            Masuk untuk mengelola portfolio
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "32px",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email */}
            <div>
              <label style={{
                display: "block", fontSize: "12px",
                fontWeight: 600, color: "var(--muted)",
                marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px",
              }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@dhafa.dev"
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--text)", fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: "block", fontSize: "12px",
                fontWeight: 600, color: "var(--muted)",
                marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px",
              }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--text)", fontSize: "14px",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as any)}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "10px 14px",
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                borderRadius: "8px",
                color: "#dc2626", fontSize: "13px",
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                width: "100%", padding: "11px",
                background: loading ? "var(--muted)" : "var(--text)",
                color: "var(--bg)",
                border: "none", borderRadius: "10px",
                fontWeight: 700, fontSize: "14px",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "4px",
                transition: "all 0.2s",
              }}
            >
              {loading ? "Masuk..." : "Masuk →"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "var(--muted)" }}>
          <a href="/" style={{ color: "var(--muted)", textDecoration: "none" }}>
            ← Kembali ke portfolio
          </a>
        </p>
      </div>
    </div>
  );
}