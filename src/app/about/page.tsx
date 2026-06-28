"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import NavbarAbout from "@/components/layout/navbarAbout";
import Footer from "@/components/layout/footer";
import {GitHubCalendar} from "react-github-calendar";

export default function AboutSection() {
  const { t } = useI18n();
  
  const aboutRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const [isMounted, setIsMounted] = useState(false);

  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    fetch("/api/projects")
      .then(res => res.json())
      .then(data => setProjectCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Set mounted menjadi true setelah komponen masuk ke browser
    setIsMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    if (aboutRef.current) observer.observe(aboutRef.current);
    return () => observer.disconnect();
  }, []);

  const infoRows = [
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 15 19.79 19.79 0 0 1 1.93 6.17 2 2 0 0 1 3.91 4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 11.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 18.93z" />
        </svg>
      ),
      label: "+62 896-2783-8251",
      link: "https://wa.me/6289627838251", // Link WhatsApp langsung chat
    },
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: "Yogyakarta, Indonesia",
    },
    {
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
      label: "dhafaa19",
      link: "https://instagram.com/dhafaa19", // Link Instagram profile
    },
    {
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
          ),
        label: "Muhammad Dhafa",
        link: "https://linkedin.com/in/mddhafa" // Link LinkedIn profile
    },
    {
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
        ),
        label: "mddhafa",
        link: "https://twitter.com/mddhafa" // Link Twitter profile
    }
  ];

  const stats = [
    ["02+", "Years Experience"],
    [`0${projectCount}+`, "Projects Completed"],
  ];

  return (
    <>
    <section
      id="about"
      ref={aboutRef}
      style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}
    >
      <NavbarAbout />
      {/* Eyebrow */}
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "3px",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 40,
          opacity: visible ? 1 : 0,
          animation: visible ? "slideUp 0.5s ease-out forwards" : "none",
        }}
      >
        About
      </p>

      {/* Two-column layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* ── SIDEBAR ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            opacity: visible ? 1 : 0,
            animation: visible ? "slideUp 0.5s ease-out 0.1s backwards" : "none",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              border: "2px solid var(--border)",
              overflow: "hidden",
              marginBottom: 16,
              background: "var(--surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* <span
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "var(--muted)",
                letterSpacing: "-2px",
              }}
            >
              MD
            </span> */}
            <img
              src="/KAI00257.JPG"
              alt="Muhammad Dhafa"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          {/* Name */}
          <h2
            style={{
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: "-0.5px",
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            Muhammad Dhafa
          </h2>
          <p
            style={{
              fontSize: 13,
              color: "var(--muted)",
              fontWeight: 500,
              marginBottom: 16,
            }}
          >
            mddhafa
          </p>

          {/* CTA button */}
          <a
            href="mailto:muhudhafa05@gmail.com"
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
            style={{
              border: "1.5px solid var(--border)",
              borderColor: hoveredBtn ? "var(--text)" : "var(--border)",
              borderRadius: 8,
              padding: "7px 16px",
              textAlign: "center",
              fontSize: 13,
              fontWeight: 600,
              color: "var(--text)",
              cursor: "pointer",
              marginBottom: 20,
              background: hoveredBtn ? "var(--surface-2)" : "var(--surface-elevated)",
              transition: "all 0.2s ease",
              textDecoration: "none",
              display: "block",
            }}
          >
            Get in touch →
          </a>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />

          {/* Info rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {infoRows.map((row, i) => {
              // Menentukan pembungkus komponen (apakah berupa link 'a' atau text 'div')
              const Component = row.link ? "a" : "div";
              
              return (
                <Component
                  key={i}
                  href={row.link}
                  target={row.link ? "_blank" : undefined}
                  rel={row.link ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    fontSize: 13,
                    // color: row.muted ? "var(--muted)" : "var(--text)",
                    textDecoration: "none",
                    cursor: row.link ? "pointer" : "default",
                  }}
                >
                  <span style={{ color: "var(--muted)", flexShrink: 0 }}>{row.icon}</span>
                  <span style={{ transition: "color 0.2s" }} className={row.link ? "info-link" : ""}>
                    {row.label}
                  </span>
                </Component>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {stats.map(([num, label], i) => (
              <div key={i}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "10px 0",
                  }}
                >
                  <span
                    style={{
                      fontSize: 30,
                      fontWeight: 900,
                      letterSpacing: "-2px",
                      color: "var(--text)",
                      lineHeight: 1,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--muted)",
                      fontWeight: 500,
                      textAlign: "right",
                      lineHeight: 1.4,
                    }}
                  >
                    {label.split(" ").map((w, j) => (
                      <span key={j}>
                        {w}
                        {j === 0 ? <br /> : ""}
                      </span>
                    ))}
                  </span>
                </div>
                {i < stats.length - 1 && (
                  <div style={{ height: 1, background: "var(--border)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Bio card */}
          <div
            style={{
              background: "var(--surface-elevated)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: "28px 32px",
              opacity: visible ? 1 : 0,
              animation: visible ? "slideUp 0.5s ease-out 0.15s backwards" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  background: "var(--text)",
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                About Me
              </span>
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: "var(--text)",
                marginBottom: 12,
              }}
            >
              Hi, I'm Muhammad Dhafa
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "var(--muted)",
                lineHeight: 1.85,
              }}
            >
              {t.about.description}
            </p>
          </div>

          {/* Approach / Interests */}
          <div
            style={{
              background: "var(--surface-elevated)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: "28px 32px",
              opacity: visible ? 1 : 0,
              animation: visible ? "slideUp 0.5s ease-out 0.2s backwards" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
                  background: "var(--text)",
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--muted)",
                }}
              >
                {t.about.approachTitle}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {t.about.approachItems.map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    animation: visible
                      ? `slideUp 0.5s ease-out ${0.25 + i * 0.07}s backwards`
                      : "none",
                  }}
                >
                  <span
                    style={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: 6,
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: "var(--muted)",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    0{i + 1}
                  </span>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text)",
                      lineHeight: 1.7,
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>



          {/* BLOK GITHUB CONTRIBUTIONS CALENDAR */}
          <div
            style={{
              background: "var(--surface-elevated)",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: "28px 32px",
              opacity: visible ? 1 : 0,
              animation: visible ? "slideUp 0.5s ease-out 0.25s backwards" : "none",
              overflowX: "auto",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 3, height: 16, background: "var(--text)", borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--muted)" }}>
                {t.about.github}
              </span>
            </div>
            
            <div style={{ minWidth: 700, minHeight: 120 }}> 
              {/* 2. Kondisikan render kalender hanya jika isMounted bernilai true */}
              {isMounted ? (
                <GitHubCalendar 
                  username="mddhafa"
                  blockSize={12}
                  blockMargin={4}
                  fontSize={12}
                  theme={{
                    light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
                    dark: ['#dfd7d7', '#97aea2', '#5aa87e', '#359249', '#10b92c'],
                  }}
                />
              ) : (
                /* Tampilkan teks loading atau placeholder kosong dengan tinggi yang sama agar layout tidak melompat */
                <div style={{ color: "var(--muted)", fontSize: 13 }}>Loading contributions...</div>
              )}
            </div>
            </div>

          {/* Quote */}
          <div
            style={{
              borderLeft: "3px solid var(--border)",
              paddingLeft: 20,
              paddingTop: 4,
              paddingBottom: 4,
              opacity: visible ? 1 : 0,
              animation: visible ? "slideUp 0.5s ease-out 0.3s backwards" : "none",
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: "var(--muted)",
                lineHeight: 1.85,
                fontStyle: "italic",
              }}
            >
              "Technology is not just a tool; it is the bridge between creativity and innovation that shapes the future."
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .info-link:hover {
          color: var(--text) !important;
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          section#about {
            padding: 80px 24px !important;
          }
          section#about > p + div {
            grid-template-columns: 1fr !important;
          }
          section#about > p + div > div:first-child {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 20px !important;
          }
          section#about > p + div > div:first-child > div:first-child {
            width: 100px !important;
            height: 100px !important;
          }
        }
      `}</style>
    </section>
    <Footer />
      </>
  );
}