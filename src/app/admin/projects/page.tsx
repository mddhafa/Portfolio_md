"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id?: number;
  title: string;
  description_id: string;
  description_en: string;
  tech_stack: string[];
  images: string[] | string;
  image_url: string;
  live_url: string;
  github_url: string;
  is_featured: boolean;
};

const EMPTY_FORM: Project = {
  title: "", description_id: "", description_en: "", tech_stack: [],
  image_url: "", images: [], live_url: "", github_url: "", is_featured: false,
};

export default function AdminProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<Project>(EMPTY_FORM);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch {
      showToast("Gagal memuat projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setTechInput("");
    setShowModal(true);
  };

  const openEdit = (p: Project) => {
    // Memastikan format images dibersihkan menjadi Array sebelum masuk ke form state
    const parseImages = () => {
      if (Array.isArray(p.images)) return p.images;
      if (typeof p.images === "string" && p.images.trim() !== "") {
        const trimmed = p.images.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
          try {
            const cleanJson = trimmed.replace(/\\"/g, '"').replace(/^"|"$/g, '');
            return JSON.parse(cleanJson);
          } catch { return []; }
        }
        if (trimmed.includes(",")) return trimmed.split(",").map(img => img.trim());
        return [trimmed.replace(/["']/g, "")];
      }
      return [];
    };

    setForm({
      ...p,
      description_id: p.description_id ?? "",
      description_en: p.description_en ?? "",
      images: parseImages() // Masukkan ke dalam state form sebagai Array bersih
    });

    const parsedTech = Array.isArray(p.tech_stack) ? p.tech_stack : JSON.parse((p.tech_stack as string) || '[]');
    setTechInput(parsedTech.join(", "));
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return showToast("Judul wajib diisi");
    setSaving(true);

    let finalImages = form.images;

    if (Array.isArray(finalImages)) {
      finalImages = JSON.stringify(finalImages);
    }

    const payload = { 
      ...form, 
      tech_stack: techInput.split(",").map(s => s.trim()).filter(Boolean),
      images: Array.isArray(form.images) ? form.images : JSON.parse((form.images as string) || '[]'),
    };

    try {
      const isEdit = !!form.id;
      const res = await fetch(isEdit ? `/api/projects/${form.id}` : "/api/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      showToast(isEdit ? "Project diperbarui" : "Project ditambahkan");
      setShowModal(false);
      fetchProjects();
    } catch {
      showToast("Gagal menyimpan project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      showToast("Project dihapus");
      setDeleteId(null);
      fetchProjects();
    } catch {
      showToast("Gagal menghapus");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };


  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!passwordForm.newPassword.trim()) return showToast("Password baru wajib diisi");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return showToast("Konfirmasi password tidak cocok");
    if (passwordForm.newPassword.length < 6) return showToast("Password minimal 6 karakter");

    setChangingPassword(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) return showToast(data.error || "Gagal mengubah password");
      
      showToast("Password berhasil diubah");
      setShowChangePassword(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      showToast("Gagal mengubah password");
    } finally {
      setChangingPassword(false);
    }
  };
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", padding: "0" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: "var(--text)", color: "var(--bg)",
          padding: "12px 20px", borderRadius: "10px",
          fontSize: "13px", fontWeight: 600,
          animation: "slideInRight 0.3s ease-out",
        }}>{toast}</div>
      )}

      {/* Header */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, background: "var(--text)",
            borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bg)" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: "15px", fontWeight: 800, letterSpacing: "-0.3px" }}>Admin Panel</h1>
            <p style={{ fontSize: "11px", color: "var(--muted)" }}>Kelola Projects</p>
          </div>
        </div>
        
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/" target="_blank" style={{
            padding: "8px 16px", borderRadius: "8px",
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--muted)", fontSize: "13px", fontWeight: 600,
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
          }}>
            Lihat Site ↗
          </a>

          <button onClick={() => setShowChangePassword(true)} style={{
            padding: "8px 16px", borderRadius: "8px",
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--muted)", fontSize: "13px", fontWeight: 600, cursor: "pointer",
          }}>
            Ganti Password
          </button>
          <button onClick={handleLogout} style={{
            padding: "8px 16px", borderRadius: "8px",
            border: "1px solid var(--border)", background: "transparent",
            color: "var(--muted)", fontSize: "13px", fontWeight: 600, cursor: "pointer",
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "32px", maxWidth: "1000px", margin: "0 auto" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px" }}>Projects</h2>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginTop: 2 }}>
              {projects.length} project tersimpan
            </p>
          </div>
          <button onClick={openAdd} style={{
            padding: "10px 20px", borderRadius: "10px",
            background: "var(--text)", color: "var(--bg)",
            border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Tambah Project
          </button>
        </div>

        {/* Projects List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--muted)" }}>Memuat...</div>
        ) : projects.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px",
            border: "2px dashed var(--border)", borderRadius: "16px",
            color: "var(--muted)",
          }}>
            <p style={{ fontSize: "14px" }}>Belum ada project.</p>
            <button onClick={openAdd} style={{
              marginTop: 16, padding: "8px 20px", borderRadius: "8px",
              background: "var(--text)", color: "var(--bg)",
              border: "none", fontWeight: 700, fontSize: "13px", cursor: "pointer",
            }}>Tambah sekarang</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {projects.map((p) => (
              <div key={p.id} style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "14px", padding: "20px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 16,
                animation: "slideUp 0.3s ease-out",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "-0.3px" }}>{p.title}</h3>
                    {p.is_featured && (
                      <span style={{
                        fontSize: "10px", fontWeight: 700,
                        background: "var(--text)", color: "var(--bg)",
                        padding: "2px 8px", borderRadius: "99px", letterSpacing: "0.5px",
                      }}>FEATURED</span>
                    )}
                  </div>
                  <p style={{
                    color: "var(--muted)", fontSize: "13px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    marginBottom: 8,
                  }}>{p.description_id || p.description_en || "Tidak ada deskripsi"}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(Array.isArray(p.tech_stack) ? p.tech_stack : JSON.parse(p.tech_stack || '[]')).slice(0, 5).map((t: string, i: number) => (
                      <span key={i} style={{
                        fontSize: "11px", padding: "2px 8px",
                        background: "var(--surface-2)", border: "1px solid var(--border)",
                        borderRadius: "6px", color: "var(--muted)", fontWeight: 500,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => openEdit(p)} style={{
                    padding: "8px 16px", borderRadius: "8px",
                    border: "1px solid var(--border)", background: "transparent",
                    color: "var(--text)", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  }}>Edit</button>
                  <button onClick={() => setDeleteId(p.id!)} style={{
                    padding: "8px 16px", borderRadius: "8px",
                    border: "1px solid rgba(220,38,38,0.3)",
                    background: "rgba(220,38,38,0.06)",
                    color: "#dc2626", fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  }}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 500,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
        }} onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div style={{
            background: "var(--surface)", borderRadius: "20px",
            border: "1px solid var(--border)",
            width: "100%", maxWidth: "560px",
            maxHeight: "90vh", overflowY: "auto",
            animation: "scaleIn 0.2s ease-out",
          }}>
            {/* Modal Header */}
            <div style={{
              padding: "24px 28px 0",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.4px" }}>
                {form.id ? "Edit Project" : "Tambah Project"}
              </h3>
              <button onClick={() => setShowModal(false)} style={{
                width: 32, height: 32, borderRadius: "8px",
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--muted)", fontSize: "16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Judul Project *", key: "title", placeholder: "Contoh: Bloom Studio" },
                { label: "URL Live Demo", key: "live_url", placeholder: "https://..." },
                { label: "URL GitHub", key: "github_url", placeholder: "https://github.com/..." },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                  <input
                    value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={{
                      width: "100%", padding: "10px 14px",
                      background: "var(--bg)", border: "1px solid var(--border)",
                      borderRadius: "10px", color: "var(--text)", fontSize: "14px", outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}
              {/* Upload Multiple Gambar */}
                <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Gambar Project
                </label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    const urls: string[] = [];

                    for (const file of files) {
                        const fd = new FormData();
                        fd.append('file', file);
                        const res = await fetch('/api/upload', { method: 'POST', body: fd });
                        const data = await res.json();
                        if (data.url) urls.push(data.url);
                    }

                    const existing = Array.isArray(form.images) ? form.images : JSON.parse((form.images as string) || '[]');
                    setForm({ ...form, images: [...existing, ...urls] });
                    }}
                    style={{
                    width: "100%", padding: "10px 14px",
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "10px", color: "var(--text)", fontSize: "14px", cursor: "pointer",
                    }}
                />

                {/* Preview gambar yang sudah diupload */}
                
                {(() => {
                    const imgs = Array.isArray(form.images) ? form.images : JSON.parse((form.images as string) || '[]');
                    const safeImgs = (() => {
                        const cleanUrlString = (str: string) => {
                            return str
                            .replace(/\\"/g, '')
                            .replace(/["'\[\]]/g, '')
                            .replace(/%22/g, '')
                            .trim();
                        };

                        if (Array.isArray(imgs)) {
                            return imgs.map(img => typeof img === 'string' ? cleanUrlString(img) : '').filter(Boolean);
                        }
                        
                        if (typeof imgs === "string" && imgs.trim() !== "") {
                            const trimmed = imgs.trim();
                            if (trimmed.includes("[") || trimmed.includes(",")) {
                            return trimmed
                                .split(",")
                                .map(img => cleanUrlString(img))
                                .filter(Boolean);
                            }
                            const singleClean = cleanUrlString(trimmed);
                            return singleClean ? [singleClean] : [];
                        }
                        return [];
                        })();
                    return safeImgs.length > 0 && (
                        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                            {safeImgs.map((url: string, i: number) => (
                            <div key={i} style={{ position: "relative" }}>
                                <img 
                                src={url} 
                                alt="" 
                                style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6 }} 
                                // DitambahkanonError handle jika URL gambarnya 404 agar tidak merusak tampilan
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                }}
                                />
                            <button
                            onClick={() => {
                                const updated = imgs.filter((_: string, idx: number) => idx !== i);
                                setForm({ ...form, images: updated });
                            }}
                            style={{
                                position: "absolute", top: -6, right: -6,
                                width: 20, height: 20, borderRadius: "50%",
                                background: "#dc2626", border: "none",
                                color: "white", fontSize: 12, cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                            >×</button>
                        </div>
                        ))}
                    </div>
                    );
                })()}
                </div>

              {/* Description id */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Deskripsi Id</label>
                <textarea
                  value={form.description_id}
                  onChange={(e) => setForm({ ...form, description_id: e.target.value })}
                  placeholder="Deskripsi singkat project..."
                  rows={3}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "10px", color: "var(--text)", fontSize: "14px",
                    outline: "none", resize: "vertical", fontFamily: "inherit",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              {/* Description en */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Deskripsi En</label>
                <textarea
                  value={form.description_en}
                  onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                  placeholder="Brief project description..."
                  rows={3}
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "10px", color: "var(--text)", fontSize: "14px",
                    outline: "none", resize: "vertical", fontFamily: "inherit",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
              </div>


              {/* Tech Stack */}
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Tech Stack</label>
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Next.js, TypeScript, MySQL"
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: "10px", color: "var(--text)", fontSize: "14px", outline: "none",
                  }}
                  onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                  onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                />
                <p style={{ fontSize: "11px", color: "var(--muted)", marginTop: 4 }}>Pisahkan dengan koma</p>
              </div>

              {/* Featured toggle */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
                  style={{
                    width: 44, height: 24, borderRadius: "99px",
                    background: form.is_featured ? "var(--text)" : "var(--border)",
                    border: "none", cursor: "pointer", position: "relative",
                    transition: "background 0.2s", flexShrink: 0,
                  }}
                >
                  <span style={{
                    position: "absolute", top: 3,
                    left: form.is_featured ? 23 : 3,
                    width: 18, height: 18, borderRadius: "50%",
                    background: form.is_featured ? "var(--bg)" : "var(--surface)",
                    transition: "left 0.2s",
                    display: "block",
                  }} />
                </button>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>Tampilkan sebagai Featured</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "0 28px 24px",
              display: "flex", gap: 10, justifyContent: "flex-end",
            }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: "10px 20px", borderRadius: "10px",
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--muted)", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              }}>Batal</button>
              <button onClick={handleSave} disabled={saving} style={{
                padding: "10px 24px", borderRadius: "10px",
                background: saving ? "var(--muted)" : "var(--text)",
                color: "var(--bg)", border: "none",
                fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
              }}>
                {saving ? "Menyimpan..." : form.id ? "Simpan Perubahan" : "Tambah Project"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 600,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
        }} onClick={(e) => e.target === e.currentTarget && setShowChangePassword(false)}>
          <div style={{
            background: "var(--surface)", borderRadius: "20px",
            border: "1px solid var(--border)",
            width: "100%", maxWidth: "420px",
            animation: "scaleIn 0.2s ease-out",
          }}>
            {/* Header */}
            <div style={{
              padding: "24px 28px 0",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <h3 style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.4px" }}>Ganti Password</h3>
              <button onClick={() => setShowChangePassword(false)} style={{
                width: 32, height: 32, borderRadius: "8px",
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--muted)", fontSize: "16px", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>×</button>
            </div>

            {/* Body */}
            <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[
                { label: "Password Lama", key: "currentPassword", placeholder: "Masukkan password lama" },
                { label: "Password Baru", key: "newPassword", placeholder: "Minimal 6 karakter" },
                { label: "Konfirmasi Password Baru", key: "confirmPassword", placeholder: "Ulangi password baru" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</label>
                  <input
                    type="password"
                    value={(passwordForm as any)[key]}
                    onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                    placeholder={placeholder}
                    style={{
                      width: "100%", padding: "10px 14px",
                      background: "var(--bg)", border: "1px solid var(--border)",
                      borderRadius: "10px", color: "var(--text)", fontSize: "14px", outline: "none",
                    }}
                    onFocus={(e) => e.target.style.borderColor = "var(--text)"}
                    onBlur={(e) => e.target.style.borderColor = "var(--border)"}
                  />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ padding: "0 28px 24px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowChangePassword(false)} style={{
                padding: "10px 20px", borderRadius: "10px",
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--muted)", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              }}>Batal</button>
              <button onClick={handleChangePassword} disabled={changingPassword} style={{
                padding: "10px 24px", borderRadius: "10px",
                background: changingPassword ? "var(--muted)" : "var(--text)",
                color: "var(--bg)", border: "none",
                fontSize: "13px", fontWeight: 700,
                cursor: changingPassword ? "not-allowed" : "pointer",
              }}>
                {changingPassword ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 600,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px",
        }}>
          <div style={{
            background: "var(--surface)", borderRadius: "16px",
            border: "1px solid var(--border)",
            padding: "28px", width: "100%", maxWidth: "360px",
            textAlign: "center", animation: "scaleIn 0.2s ease-out",
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: "12px",
              background: "rgba(220,38,38,0.1)", margin: "0 auto 16px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/><path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
              </svg>
            </div>
            <h4 style={{ fontSize: "16px", fontWeight: 800, marginBottom: 8 }}>Hapus Project?</h4>
            <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: 24 }}>
              Tindakan ini tidak bisa dibatalkan.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setDeleteId(null)} style={{
                flex: 1, padding: "10px", borderRadius: "10px",
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--muted)", fontSize: "13px", fontWeight: 600, cursor: "pointer",
              }}>Batal</button>
              <button onClick={() => handleDelete(deleteId)} style={{
                flex: 1, padding: "10px", borderRadius: "10px",
                background: "#dc2626", border: "none",
                color: "white", fontSize: "13px", fontWeight: 700, cursor: "pointer",
              }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}