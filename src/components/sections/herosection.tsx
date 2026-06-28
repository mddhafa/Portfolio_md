"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useRouter } from "next/navigation";

interface HeroSectionProps {
  scrolled?: boolean;
}

export default function HeroSection({ scrolled }: HeroSectionProps) {
  const { t } = useI18n();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjectCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setMounted(true);

    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 12;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        padding: "120px 40px 60px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        gap: "80px",
        maxWidth: 1200,
        margin: "0 auto",
        position: "relative",
      }}
    >
      {/* Background decorative elements */}
      <div style={{
        position: "absolute",
        top: "15%", right: "5%",
        width: 300, height: 300,
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--surface-2) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        opacity: 0.6,
      }} />
      <div style={{
        position: "absolute",
        bottom: "20%", left: "2%",
        width: 200, height: 200,
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--border) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
        opacity: 0.5,
      }} />

      {/* ── LEFT: Text ── */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>

        {/* Eyebrow tag */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          marginBottom: 24,
          animation: mounted ? "slideInLeft 0.6s ease-out 0.1s backwards" : "none",
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 99, padding: "6px 14px",
            fontSize: 12, fontWeight: 600, color: "var(--muted)",
            letterSpacing: "0.03em",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
              boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            {t.hero.tag}
          </span>
        </div>

        {/* Greeting */}
        <p style={{
          color: "var(--muted)", fontSize: 14, fontWeight: 500,
          marginBottom: 10, letterSpacing: "0.04em",
          animation: mounted ? "slideInLeft 0.6s ease-out 0.2s backwards" : "none",
        }}>
          {t.hero.greeting}
        </p>

        {/* Main title */}
        <h1 style={{
          fontSize: "clamp(38px, 4.5vw, 60px)",
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "-2.5px",
          marginBottom: 10,
          color: "var(--text)",
          animation: mounted ? "slideInLeft 0.6s ease-out 0.3s backwards" : "none",
        }}>
          {t.hero.title}
        </h1>

        {/* Subtitle with underline accent */}
        {/* <div style={{
          marginBottom: 28,
          animation: mounted ? "slideInLeft 0.6s ease-out 0.35s backwards" : "none",
        }}>
          <span style={{
            fontSize: "clamp(16px, 2vw, 22px)",
            fontWeight: 700, color: "var(--muted)",
            letterSpacing: "-0.5px",
            borderBottom: "2px solid var(--border)",
            paddingBottom: 2,
          }}>
            & Computer Vision Engineer
          </span>
        </div> */}

        {/* Description */}
        <p style={{
          color: "var(--muted)", fontSize: 15, lineHeight: 1.75,
          marginBottom: 40, maxWidth: 460,
          animation: mounted ? "slideInLeft 0.6s ease-out 0.4s backwards" : "none",
        }}>
          {t.hero.role}
        </p>

        {/* CTA row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
          animation: mounted ? "slideInLeft 0.6s ease-out 0.5s backwards" : "none",
        }}>
          {/* <a
            href="/cv.pdf"
            download
            style={{
              padding: "12px 28px", borderRadius: 10,
              background: "var(--text)", color: "var(--bg)",
              border: "none", fontWeight: 700, fontSize: 14,
              cursor: "pointer", fontFamily: "inherit",
              textDecoration: "none", display: "inline-flex",
              alignItems: "center", gap: 8,
              transition: "all 0.25s ease",
              letterSpacing: "-0.2px",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(-3px)";
              el.style.boxShadow = "0 12px 28px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.transform = "translateY(0)";
              el.style.boxShadow = "none";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Download CV
          </a> */}

          {/* Divider */}
          {/* <div style={{ width: 1, height: 28, background: "var(--border)" }} /> */}

          {/* Social links */}
          <div style={{ display: "flex", gap: 8 }}>
            {[
              {
                id: "linkedin", label: "LinkedIn",
                url: "https://linkedin.com/in/mddhafa",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                ),
              },
              {
                id: "github", label: "GitHub",
                url: "https://github.com/mddhafa",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                ),
              },
            ].map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer"
                title={item.label}
                style={{
                  width: 40, height: 40,
                  border: "1px solid var(--border)",
                  borderRadius: 10, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: "var(--muted)", textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "var(--text)";
                  el.style.color = "var(--text)";
                  el.style.background = "var(--surface)";
                  el.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "var(--border)";
                  el.style.color = "var(--muted)";
                  el.style.background = "transparent";
                  el.style.transform = "translateY(0)";
                }}
              >{item.icon}</a>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 32, marginTop: 52,
          paddingTop: 32, borderTop: "1px solid var(--border)",
          animation: mounted ? "slideInLeft 0.6s ease-out 0.6s backwards" : "none",
        }}>
          {[
            { num: "02+", label: "Years exp." },
            { num: projectCount.toString() + "+", label: "Projects" },
          ].map(({ num, label }) => (
            <div key={label}>
              <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-1px", color: "var(--text)", lineHeight: 1 }}>{num}</div>
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 500, marginTop: 4, letterSpacing: "0.03em" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Photo ── */}
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center",
        position: "relative", zIndex: 1,
        animation: mounted ? "slideInRight 0.7s ease-out 0.2s backwards" : "none",
      }}>
        {/* Outer glow ring */}
        <div style={{
          position: "absolute",
          width: "108%", height: "108%",
          borderRadius: "50% 50% 40% 40%",
          border: "1px dashed var(--border)",
          animation: "spinSlow 20s linear infinite",
          opacity: 0.5,
        }} />

        {/* Floating card — top left */}
        {/* <div style={{
          position: "absolute", top: "8%", left: "-12%",
          background: "var(--surface-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12, padding: "10px 14px",
          fontSize: 11, fontWeight: 700, color: "var(--text)",
          boxShadow: "0 8px 24px var(--shadow-soft)",
          display: "flex", alignItems: "center", gap: 7,
          animation: "floatA 4s ease-in-out infinite",
          whiteSpace: "nowrap",
          zIndex: 2,
        }}>
          <span style={{ fontSize: 16 }}>#</span>
          #OPENTOWORK
        </div> */}

        {/* Floating card — bottom right */}
        <div style={{
          position: "absolute", bottom: "10%", right: "-10%",
          background: "var(--surface-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 12, padding: "10px 14px",
          fontSize: 11, fontWeight: 700, color: "var(--text)",
          boxShadow: "0 8px 24px var(--shadow-soft)",
          display: "flex", alignItems: "center", gap: 7,
          animation: "floatB 4.5s ease-in-out infinite",
          whiteSpace: "nowrap",
          zIndex: 2,
        }}>
          {/* <span style={{ fontSize: 16 }}>🤖</span> */}
          #OPENTOWORK
        </div>

        {/* Photo container with parallax */}
        <div
          onClick={() => router.push("/about")}
          style={{
            width: "100%", maxWidth: 360,
            aspectRatio: "3/4",
            borderRadius: "120px 120px 32px 32px",
            overflow: "hidden",
            border: "1px solid var(--border)",
            position: "relative",
            transform: `perspective(800px) rotateX(${-mousePos.y * 0.3}deg) rotateY(${mousePos.x * 0.3}deg) translateZ(0)`,
            transition: "transform 0.12s ease-out",
            boxShadow: `${-mousePos.x * 1.5}px ${mousePos.y * 1.5}px 40px var(--shadow-soft)`,
            cursor: "pointer",
          }}
        >
          <img
            src="/KAI00257.JPG"
            alt="Muhammad Dhafa"
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: `scale(1.05) translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
              transition: "transform 0.15s ease-out",
            }}
          />

          {/* Gradient overlay bottom */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: "35%",
            background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)",
          }} />

          {/* Name tag on photo */}
          <div style={{
            position: "absolute", bottom: 18, left: 0, right: 0,
            textAlign: "center",
          }}>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: "0.12em", textTransform: "uppercase",
            }}>{t.hero.foto}</span>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes floatB {
          0%, 100% { transform: translateY(0px) rotate(1deg); }
          50%       { transform: translateY(-12px) rotate(-1deg); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
          50%       { opacity: 0.8; box-shadow: 0 0 0 6px rgba(34,197,94,0.08); }
        }

        @media (max-width: 768px) {
          section#home {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
            padding: 100px 24px 48px !important;
          }
          section#home > div:last-of-type {
            order: -1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>
    </section>
  );
}