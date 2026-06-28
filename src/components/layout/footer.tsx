"use client";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
    const { t } = useI18n();

    return (
         <footer style={{
        padding: "60px 20px",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <h2 style={{ 
          fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 16,
          animation: "slideUp 0.6s ease-out"
        }}>
          {t.footer.title}
        </h2>
        <p style={{ 
          color: "var(--muted)", fontSize: 14, marginBottom: 32,
          animation: "slideUp 0.6s ease-out 0.1s backwards"
        }}>{t.footer.description}</p>
        <a href="mailto:muhdhafa05@gmail.com" style={{
          padding: "12px 32px", borderRadius: 99,
          background: "var(--text)", color: "var(--bg)",
          fontWeight: 700, fontSize: 14,
          textDecoration: "none", display: "inline-block",
          animation: "slideUp 0.6s ease-out 0.2s backwards",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-4px)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 24px rgba(0,0,0,0.2)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
        }}
        >{t.footer.cta}</a>
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 48 }}>© 2026 Muhammad Dhafa.</p>
      </footer>
    );
}