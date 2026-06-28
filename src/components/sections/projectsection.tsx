"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

type Project = {
  id: number;
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  tech_stack: string[] | string;
  images: string[] | string;
  image_url: string;
  live_url: string;
  github_url: string;
  is_featured: boolean;
  created_at: string;
};

function ImageSlider({ images, height = 200 }: { images: string[]; height?: number }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const safeImages = Array.isArray(images) ? images : [];



  const { locale } = useI18n();

  const getDesc = (project: any) => {
    if (locale === "id") return project.description_id || project.description_en || project.description || "";
    return project.description_en || project.description_id || project.description || "";
  };

  const next = useCallback(() => {
    if (safeImages.length === 0) return;
    setCurrent((prev) => (prev + 1) % safeImages.length);
  }, [safeImages.length]);

  useEffect(() => {
    if (safeImages.length <= 1) return;
    timerRef.current = setInterval(next, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, safeImages.length]);

  const goTo = (i: number) => {
    setCurrent(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 3000);
  };

  if (safeImages.length === 0) {
    return (
      <div style={{
        height, borderRadius: 10, marginBottom: 20,
        background: "var(--bg)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          No Preview
        </span>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height, borderRadius: 10, marginBottom: 20, overflow: "hidden", border: "1px solid var(--border)" }}>
      {safeImages.map((src, i) => (
        <img key={i} src={src} alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            opacity: i === current ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        />
      ))}
      {safeImages.length > 1 && (
        <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5 }}>
          {safeImages.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); goTo(i); }} style={{
              width: i === current ? 20 : 6, height: 6, borderRadius: 99,
              background: i === current ? "white" : "rgba(255,255,255,0.5)",
              border: "none", cursor: "pointer", padding: 0, transition: "all 0.3s ease",
            }} />
          ))}
        </div>
      )}
      {safeImages.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); goTo((current - 1 + safeImages.length) % safeImages.length); }}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <button onClick={(e) => { e.stopPropagation(); goTo((current + 1) % safeImages.length); }}
            style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", color: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
        </>
      )}
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { locale, t } = useI18n();
  const [visible, setVisible] = useState(false);

  const getImages = (imgs: any, fallbackUrl: string): string[] => {
    const clean = (s: string) => s.replace(/\\"/g, '').replace(/["'\[\]]/g, '').replace(/%22/g, '').trim();
    if (Array.isArray(imgs)) return imgs.map(i => typeof i === 'string' ? clean(i) : '').filter(Boolean);
    if (typeof imgs === 'string' && imgs.trim()) {
      const t = imgs.trim();
      if (t.includes('[') || t.includes(',')) return t.split(',').map(clean).filter(Boolean);
      const s = clean(t); return s ? [s] : fallbackUrl ? [clean(fallbackUrl)] : [];
    }
    return fallbackUrl ? [fallbackUrl] : [];
  };

  const getTechStack = (tech: string[] | string): string[] => {
    if (Array.isArray(tech)) return tech;
    try { return JSON.parse(tech); } catch { return []; }
  };

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => setVisible(true));

    // Lock scroll
    document.body.style.overflow = 'hidden';
    
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const images = getImages(project.images, project.image_url);
  const techStack = getTechStack(project.tech_stack);
  const title = locale === 'en' && project.title_en ? project.title_en : project.title;
  const description = locale === 'en' && project.description_en ? project.description_en : project.description;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: visible ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(8px)" : "blur(0px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        transition: "all 0.3s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 20,
          width: "100%", maxWidth: 680,
          maxHeight: "88vh",
          overflowY: "auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
          transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
          scrollbarWidth: "none",
        }}
      >
        {/* Image slider fullsize */}
        <div style={{ position: "relative" }}>
          <ImageSlider images={images} height={320} />

          {/* Close button */}
          <button onClick={handleClose} style={{
            position: "absolute", top: 12, right: 12,
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(0,0,0,0.5)", border: "none",
            color: "white", fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
            zIndex: 10,
            transition: "all 0.2s ease",
          }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.8)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.5)"}
          >×</button>

          {/* Featured badge */}
          {project.is_featured && (
            <div style={{
              position: "absolute", top: 12, left: 12,
              background: "var(--text)", color: "var(--bg)",
              fontSize: 10, fontWeight: 800, letterSpacing: "0.8px",
              padding: "4px 10px", borderRadius: 99,
              textTransform: "uppercase",
            }}>Featured</div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "28px 32px 32px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text)", marginBottom: 4 }}>
                {title}
              </h2>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>
                {new Date(project.created_at).getFullYear()}
              </span>
            </div>
            {/* Links */}
            <div style={{ display: "flex", gap: 8 }}>
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" style={{
                  padding: "8px 18px", borderRadius: 10,
                  background: "var(--text)", color: "var(--bg)",
                  fontSize: 13, fontWeight: 700, textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "opacity 0.2s ease",
                }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLAnchorElement).style.opacity = "0.8"}
                  onMouseLeave={(e) => (e.currentTarget as HTMLAnchorElement).style.opacity = "1"}
                >
                  Live
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" style={{
                  padding: "8px 18px", borderRadius: 10,
                  border: "1px solid var(--border)", background: "transparent",
                  color: "var(--text)", fontSize: 13, fontWeight: 700, textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 5,
                  transition: "all 0.2s ease",
                }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--text)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--surface-2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  GitHub
                </a>
              )}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />

          {/* Description */}
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.8, marginBottom: 24 }}>
            {description || "Tidak ada deskripsi."}
          </p>

          {/* Tech stack */}
          {techStack.length > 0 && (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 10 }}>
                Tech Stack
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {techStack.map((tech: string, i: number) => (
                  <span key={i} style={{
                    padding: "6px 14px",
                    background: "var(--surface-2)", border: "1px solid var(--border)",
                    borderRadius: 8, fontSize: 12, fontWeight: 600, color: "var(--text)",
                  }}>{tech}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectSection() {
  const { locale, t } = useI18n();
  const projectsRef = useRef<HTMLDivElement>(null);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => { setProjects(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
      }),
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );
    const section = projectsRef.current;
    if (section) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const getImages = (imgs: any, fallbackUrl: string): string[] => {
    const clean = (s: string) => s.replace(/\\"/g, '').replace(/["'\[\]]/g, '').replace(/%22/g, '').trim();
    if (Array.isArray(imgs)) return imgs.map(i => typeof i === 'string' ? clean(i) : '').filter(Boolean);
    if (typeof imgs === 'string' && imgs.trim()) {
      const trimmed = imgs.trim();
      if (trimmed.includes('[') || trimmed.includes(',')) return trimmed.split(',').map(clean).filter(Boolean);
      const s = clean(trimmed); return s ? [s] : fallbackUrl ? [clean(fallbackUrl)] : [];
    }
    return fallbackUrl ? [fallbackUrl] : [];
  };

  const getTechStack = (tech: string[] | string): string[] => {
    if (Array.isArray(tech)) return tech;
    try { return JSON.parse(tech); } catch { return []; }
  };

  return (
    <>
      <section id="projects" ref={projectsRef} style={{ padding: "100px 40px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <h2 style={{
            fontSize: 36, fontWeight: 800, letterSpacing: "-1px", marginBottom: 16, color: "var(--text)",
            animation: visibleSections["projects"] ? "slideUp 0.6s ease-out" : "none",
          }}>{t.projects.title}</h2>
          <p style={{
            color: "var(--muted)", fontSize: 14,
            animation: visibleSections["projects"] ? "slideUp 0.6s ease-out 0.1s backwards" : "none",
          }}>
            {t.projects.description}
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "28px 24px", height: 360,
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && projects.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 40px",
            border: "2px dashed var(--border)", borderRadius: 16, color: "var(--muted)",
          }}>
            <p style={{ fontSize: 14 }}>
              
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && projects.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {projects.map((p, index) => {
              const techStack = getTechStack(p.tech_stack);
              const images = getImages(p.images, p.image_url);
              const title = locale === 'en' && p.title_en ? p.title_en : p.title;
              const description = locale === 'en' && p.description_en ? p.description_en : p.description;

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 16, padding: "24px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    animation: visibleSections["projects"] ? `slideUp 0.6s ease-out ${0.1 + index * 0.1}s backwards` : "none",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "var(--text)";
                    el.style.transform = "translateY(-8px)";
                    el.style.background = "var(--surface-elevated)";
                    el.style.boxShadow = "0 20px 40px var(--shadow-soft)";
                    const overlay = el.querySelector('.hover-overlay') as HTMLDivElement;
                    if (overlay) overlay.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "var(--border)";
                    el.style.transform = "translateY(0)";
                    el.style.background = "var(--surface)";
                    el.style.boxShadow = "none";
                    const overlay = el.querySelector('.hover-overlay') as HTMLDivElement;
                    if (overlay) overlay.style.opacity = "0";
                  }}
                >
                  {/* Hover overlay hint */}
                  <div className="hover-overlay" style={{
                    position: "absolute", inset: 0, zIndex: 2,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "rgba(0,0,0,0.04)",
                    opacity: 0, transition: "opacity 0.3s ease",
                    borderRadius: 16, pointerEvents: "none",
                  }}>
                    <div style={{
                      background: "var(--text)", color: "var(--bg)",
                      padding: "10px 20px", borderRadius: 99,
                      fontSize: 12, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 6,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
                      </svg>
                      Lihat Detail
                    </div>
                  </div>

                  {/* Slider */}
                  <ImageSlider images={images} height={200} />

                  {/* Title & year */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{title}</h3>
                    <span style={{ fontSize: 10, color: "var(--muted)", fontWeight: 600, letterSpacing: "0.05em" }}>
                      {new Date(p.created_at).getFullYear()}
                    </span>
                  </div>

                  {/* Tech stack */}
                  {techStack.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                      {techStack.slice(0, 3).map((tech: string, i: number) => (
                        <span key={i} style={{
                          background: "var(--surface-2)", border: "1px solid var(--border)",
                          borderRadius: 6, padding: "4px 10px",
                          fontSize: 11, color: "var(--muted)", fontWeight: 500,
                        }}>{tech}</span>
                      ))}
                    </div>
                  )}

                  {/* Description */}
                  <p style={{
                    color: "var(--muted)", fontSize: 13, lineHeight: 1.6,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {description || "Tidak ada deskripsi."}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      </section>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}