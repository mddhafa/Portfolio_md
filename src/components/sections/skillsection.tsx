"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

const SKILLS = [
  { name: "Flutter", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", category: "Mobile" },
  { name: "Kotlin", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg", category: "Mobile" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", category: "Web" },
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", category: "Backend" },
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", category: "Web" },
  { name: "Laravel", icon: "https://cdn.simpleicons.org/laravel/FF2D20", category: "Web" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", category: "Web" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", category: "Web" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", category: "Backend" },
  { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", category: "Backend" },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", category: "Tools" },
  { name: "Tailwind", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", category: "Web" },
  { name: "Prisma", icon: "https://cdn.simpleicons.org/prisma/2D3748", category: "Backend" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", category: "Tools" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", category: "Backend" },
  { name: "php", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", category: "Backend" }
];

const CATEGORIES = ["All", "Web", "Mobile", "Backend", "Tools"];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), 600);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered =
    activeCategory === "All"
      ? SKILLS
      : SKILLS.filter((s) => s.category === activeCategory);

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{ padding: "100px 40px", maxWidth: 1100, margin: "0 auto" }}
    >
      {/* Header — split layout */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 56,
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--muted)",
              marginBottom: 12,
            }}
          >
            Expertise
          </p>
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 900,
              letterSpacing: "-1.5px",
              color: "var(--text)",
              lineHeight: 1.05,
            }}
          >
            {t.skills.title}
          </h2>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "var(--muted)",
            lineHeight: 1.75,
            maxWidth: 220,
            paddingTop: 8,
          }}
        >
          {t.skills.description}
        </p>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          flexWrap: "wrap",
          marginBottom: 44,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              // JIKA belum mounted di client, hilangkan atribut disabled total agar server & client menganggapnya 'null'
              disabled={mounted ? !visible : undefined}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "7px 20px",
                borderRadius: 99,
                border: "1.5px solid",
                borderColor: isActive ? "var(--text)" : "var(--border)",
                background: isActive ? "var(--text)" : "transparent",
                color: isActive ? "var(--bg)" : "var(--muted)",
                fontSize: 12,
                fontWeight: isActive ? 700 : 600,
                cursor: mounted && visible ? "pointer" : "default",
                fontFamily: "inherit",
                letterSpacing: "0.5px",
                opacity: mounted && visible ? 1 : 0.5,
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Skill cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 12,
        }}
      >
        {!visible
          ? // SKELETON STATE
            Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="skeleton-pulse"
                style={{
                  background: "var(--surface-elevated)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 20,
                  padding: "28px 20px 22px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  height: 145,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    backgroundColor: "var(--border)",
                    borderRadius: 8,
                    marginBottom: 20,
                  }}
                />
                <div
                  style={{
                    width: "70%",
                    height: 14,
                    backgroundColor: "var(--border)",
                    borderRadius: 4,
                    marginBottom: 10,
                  }}
                />
                <div
                  style={{
                    width: "40%",
                    height: 10,
                    backgroundColor: "var(--border)",
                    borderRadius: 4,
                  }}
                />
              </div>
            ))
          : // ACTUAL DATA STATE
            filtered.map((skill, index) => {
              const isHovered = hoveredIndex === index;
              return (
                <div
                  key={skill.name}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    background: "var(--surface-elevated)",
                    border: "1.5px solid",
                    borderColor: isHovered ? "var(--text)" : "var(--border)",
                    borderRadius: 20,
                    padding: "28px 20px 22px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 0,
                    cursor: "default",
                    position: "relative",
                    overflow: "hidden",
                    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                    transition:
                      "border-color 0.25s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: `slideUp 0.45s ease-out ${index * 0.03}s backwards`,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: isHovered ? "var(--text)" : "var(--border)",
                      borderRadius: "20px 20px 0 0",
                      transition: "background 0.25s ease",
                    }}
                  />

                  <img
                    src={skill.icon}
                    alt={skill.name}
                    width={44}
                    height={44}
                    style={{
                      objectFit: "contain",
                      marginBottom: 20,
                      borderRadius: 8,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "var(--text)",
                      letterSpacing: "-0.3px",
                      lineHeight: 1.2,
                      marginBottom: 6,
                    }}
                  >
                    {skill.name}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                    }}
                  >
                    {skill.category}
                  </span>
                </div>
              );
            })}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .skeleton-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        @media (max-width: 768px) {
          section#skills {
            padding: 80px 24px !important;
          }
          section#skills > div:first-child {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}