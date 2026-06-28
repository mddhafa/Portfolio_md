"use client";

import { useState, useEffect, useRef } from "react";

const SERVICES = [
  {
    title: "Full-Stack Web Development",
    desc: "Membangun aplikasi web yang responsif, interaktif, dan user-friendly dari hulu ke hilir. Menggunakan teknologi frontend terkini seperti Next.js untuk antarmuka yang cepat serta Laravel atau Node.js/Express.js untuk arsitektur backend yang kokoh.",
  },
  {
    title: "Mobile Application Development",
    desc: "Mengembangkan aplikasi mobile lintas platform (Android & iOS) menggunakan Teck Stack yang relevan untuk kebutuhan sistem monitoring real-time, manajemen data, maupun aplikasi interaktif lainnya.",
  },
  {
    title: "Backend & API Integration",
    desc: "Merancang arsitektur database yang efisien (MySQL/PostgreSQL) menggunakan ORM seperti Prisma, membangun RESTful API yang aman untuk pertukaran data real-time, serta menerapkan kontainerisasi dengan Docker untuk mempermudah proses deployment.",
    
  },
  {
    title: "AI & Computer Vision Implementation",
    desc: "Mengembangkan dan mengimplementasikan model kecerdasan buatan khususnya object detection (seperti keluarga model YOLO dan RT-DETR). Berpengalaman dalam data preprocessing, anotasi, hingga optimasi model agar efisien saat dijalankan pada perangkat dengan komputasi terbatas (edge devices).",
    
  },
];

export default function ServiceSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) setVisible(true);
        },
        { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
        );
    
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
            <section
      id="services"
      ref={sectionRef}
      style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}
    >
      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-1px",
            marginBottom: 16,
            color: "var(--text)",
            animation: visible ? "slideUp 0.6s ease-out" : "none",
          }}
        >
          Services
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 14,
            animation: visible ? "slideUp 0.6s ease-out 0.1s backwards" : "none",
          }}
        >
          Designing clean, scalable, responsive websites
        </p>
      </div>
 
      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {SERVICES.map((service, index) => (
          <div
            key={service.title}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "32px 24px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "default",
              animation: visible
                ? `slideUp 0.6s ease-out ${0.2 + index * 0.1}s backwards`
                : "none",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = "var(--text)";
              el.style.transform = "translateY(-8px)";
              el.style.background = "var(--surface-elevated)";
              el.style.boxShadow = "0 20px 40px var(--shadow-soft)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = "var(--border)";
              el.style.transform = "translateY(0)";
              el.style.background = "var(--surface)";
              el.style.boxShadow = "none";
            }}
          >
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 14,
                lineHeight: 1.3,
                color: "var(--text)",
              }}
            >
              {service.title}
            </h3>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              {service.desc}
            </p>
 
            {/* Tags */}
            {/* <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {service.tags.map((tag) => (
                <div
                  key={tag}
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 12,
                    color: "var(--muted)",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "var(--text)";
                    el.style.background = "var(--surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "var(--border)";
                    el.style.background = "var(--bg)";
                  }}
                >
                  {tag}
                </div>
              ))}
            </div> */}
          </div>
        ))}
      </div>
 
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
 
        @media (max-width: 768px) {
          section#services {
            padding: 80px 24px !important;
          }
        }
      `}</style>
    </section>
  );
}