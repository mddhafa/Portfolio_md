"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function AboutSection() {
    const { t } = useI18n();
    const aboutRef = useRef<HTMLDivElement>(null);
    const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});


    useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    }, observerOptions);

    const sections = [aboutRef.current];
    sections.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

    return ( 
        <section id="about" ref={aboutRef} style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 20, padding: "64px 48px",
          animation: visibleSections["about"] ? "slideUp 0.6s ease-out" : "none",
          transition: "all 0.3s ease",
        }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 24, color: "var(--text)" }}>
            {t.about.title}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginBottom: 56 }}>
            {t.about.description}
          </p>

          <h3 style={{ fontSize: 12, fontWeight: 700, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 }}>
            {t.about.approachTitle}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 64 }}>
          {t.about.approachItems.map((item, i) => (
              <div key={item} style={{
                background: "var(--bg)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "18px 20px",
                display: "flex", alignItems: "center", gap: 14,
                animation: visibleSections["about"] ? `slideUp 0.6s ease-out ${0.1 + i * 0.1}s backwards` : "none",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--text)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateX(4px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
              }}
              >
                <span style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 800, color: "var(--muted)", flexShrink: 0,
                }}>0{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 40 }}>
            {[["02+", "Years Of Experience"], ["15+", "Projects Completed"], ["05+", "Clients Served"]].map(([num, label], i) => (
              <div key={label}
                style={{
                  animation: visibleSections["about"] ? `slideUp 0.6s ease-out ${0.2 + i * 0.1}s backwards` : "none"
                }}
              >
                <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: 8, color: "var(--text)" }}>{num}</div>
                <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}
