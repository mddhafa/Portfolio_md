"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function NavbarAbout() {
  const { t, locale, toggle } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // href tiap nav link mengarah ke halaman utama + anchor
  const NAV_HREFS = ["/#home", "/#about", "/#skills", "/#services", "/#projects"];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

        {/* Back to home — shortcut */}
          <a href="/" style={{
            padding: "7px 14px", borderRadius: 99,
            background: "transparent",
            border: "1px solid var(--border)",
            color: "var(--muted)", fontWeight: 700, fontSize: 11,
            cursor: "pointer", fontFamily: "inherit",
            letterSpacing: "0.08em",
            textDecoration: "none",
            display: "flex", alignItems: "center", gap: 5,
            transition: "all 0.2s ease",
          }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--text)";
              el.style.color = "var(--text)";
              el.style.background = "var(--surface-2)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--border)";
              el.style.color = "var(--muted)";
              el.style.background = "transparent";
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Home
          </a>

        {/* Center nav links — desktop, semua ke halaman utama */}
        {/* <div style={{
          display: "flex", gap: 2,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 99, padding: "4px",
          position: "absolute", left: "50%",
          transform: "translateX(-50%)",
        }} className="desktop-nav">
          {t.nav.links.map((link, i) => (
            <a
              key={link}
              href={NAV_HREFS[i]}
              style={{
                padding: "6px 18px", borderRadius: 99,
                fontSize: 13, fontWeight: 500,
                color: "var(--muted)",
                background: "transparent",
                textDecoration: "none",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--text)";
                (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
              }}
            >{link}</a>
          ))}
        </div> */}

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
          <a href="/#contact" style={{
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
          {/* Back to home row */}
          <a href="/" style={{
            padding: "12px 16px", borderRadius: 10,
            fontSize: 14, fontWeight: 600,
            color: "var(--muted)",
            background: "transparent",
            textDecoration: "none", display: "flex",
            alignItems: "center", gap: 8,
            borderLeft: "2px solid transparent",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Home
          </a>
          <div style={{ height: 1, background: "var(--border)", margin: "4px 0 8px" }} />
          {t.nav.links.map((link, i) => (
            <a
              key={link}
              href={NAV_HREFS[i]}
              onClick={() => setMenuOpen(false)}
              style={{
                padding: "12px 16px", borderRadius: 10,
                fontSize: 14, fontWeight: 500,
                color: "var(--muted)",
                background: "transparent",
                textDecoration: "none", display: "block",
                borderLeft: "2px solid transparent",
                transition: "all 0.15s ease",
              }}
            >{link}</a>
          ))}
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