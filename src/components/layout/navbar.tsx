"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const { t, locale, toggle } = useI18n();
  const [activeSection, setActiveSection] = useState(t.nav.links[0]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_HREFS = ["home", "skills", "projects"];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = NAV_HREFS.indexOf(entry.target.id);
            if (idx !== -1) setActiveSection(t.nav.links[idx]);
          }
        });
      },
      { threshold: 0.4 }
    );
    NAV_HREFS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [t.nav.links]);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? "10px 40px" : "18px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(var(--surface-rgb, 255,250,242), 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        {/* Logo */}
        <a href="/about" style={{ textDecoration: "none" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
          }}>
            
            {/* <span style={{
              fontSize: 13, fontWeight: 700,
              color: "var(--text)", letterSpacing: "-0.3px",
              display: scrolled ? "none" : "block",
              transition: "all 0.3s ease",
            }}>Muhammad Dhafa</span> */}

            <img src="/favicon.png" alt="Logo" style={{ width: 50, height: 50, borderRadius: 9, objectFit: "cover" }} />
          </div>
        </a>

        {/* Center nav links — desktop */}
        <div style={{
          display: "flex", gap: 2,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 99, padding: "4px",
          position: "absolute", left: "50%",
          transform: "translateX(-50%)",
        }}
          className="desktop-nav"
        >
          {t.nav.links.map((link, i) => {
            const isActive = activeSection === link;
            return (
              <a key={link} href={`#${NAV_HREFS[i]}`}
                onClick={() => setActiveSection(link)}
                style={{
                  padding: "6px 18px", borderRadius: 99,
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--bg)" : "var(--muted)",
                  background: isActive ? "var(--text)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  letterSpacing: isActive ? "-0.2px" : "0",
                }}
              >{link}</a>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          
          {/* Lang toggle */}
          <button onClick={toggle} style={{
            padding: "7px 14px", borderRadius: 99,
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--muted)", fontWeight: 700, fontSize: 11,
            cursor: "pointer", fontFamily: "inherit",
            letterSpacing: "0.08em",
            transition: "all 0.2s ease",
            display: "flex", alignItems: "center", gap: 5,
          }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--text)";
              el.style.color = "var(--text)";
              el.style.background = "var(--surface-2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--border)";
              el.style.color = "var(--muted)";
              el.style.background = "transparent";
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 0 20M2 12h20"/>
            </svg>
            {locale === "id" ? "EN" : "ID"}
          </button>

          {/* CTA */}
          <a href="https://wa.me/6289627838251" style={{
            padding: "8px 20px", borderRadius: 99,
            background: "var(--text)", color: "var(--bg)",
            border: "none", fontWeight: 700, fontSize: 13,
            cursor: "pointer", fontFamily: "inherit",
            textDecoration: "none", display: "inline-block",
            letterSpacing: "-0.2px",
            transition: "all 0.2s ease",
          }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "0.85";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >{t.nav.cta}</a>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              width: 36, height: 36, borderRadius: 8,
              border: "1px solid var(--border)",
              background: "transparent", cursor: "pointer",
              alignItems: "center", justifyContent: "center",
              color: "var(--text)",
            }}
            className="hamburger"
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 99,
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
          padding: "16px 24px 24px",
          display: "flex", flexDirection: "column", gap: 4,
          animation: "slideUp 0.2s ease-out",
        }}>
          {t.nav.links.map((link, i) => {
            const isActive = activeSection === link;
            return (
              <a key={link} href={`#${NAV_HREFS[i]}`}
                onClick={() => { setActiveSection(link); setMenuOpen(false); }}
                style={{
                  padding: "12px 16px", borderRadius: 10,
                  fontSize: 14, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--text)" : "var(--muted)",
                  background: isActive ? "var(--surface-2)" : "transparent",
                  textDecoration: "none", display: "block",
                  borderLeft: isActive ? "2px solid var(--text)" : "2px solid transparent",
                  transition: "all 0.15s ease",
                }}
              >{link}</a>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}