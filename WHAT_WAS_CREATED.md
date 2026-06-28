# Backend Integration - What's Been Created

Ringkasan lengkap file dan struktur yang sudah dibuat untuk koneksi backend.

## 📦 Files Created

### Core Configuration & Services

| File | Purpose |
|------|---------|
| `src/lib/config.ts` | Backend URL & endpoint configuration |
| `src/lib/services/backendService.ts` | API client untuk komunikasi dengan backend |
| `src/lib/services/authService.ts` | Authentication & token management |

### React Hooks

| File | Purpose |
|------|---------|
| `src/lib/hooks/useProjectsBackend.ts` | 5 hooks untuk project management |
| `src/lib/hooks/useAuth.ts` | 6 hooks untuk authentication |
| `src/lib/hooks/useProjects.ts` | Original hooks (fallback) |

### API Routes (Frontend)

| File | Purpose |
|------|---------|
| `src/app/api/projects/route.ts` | GET /POST untuk projects (proxy ke backend) |
| `src/app/api/projects/[id]/route.ts` | GET/PATCH/DELETE untuk single project |

### Configuration Files

| File | Purpose |
|------|---------|
| `.env.example` | Environment variable template |

### Documentation

| File | Purpose |
|------|---------|
| `BACKEND_INTEGRATION.md` | Panduan integrasi lengkap |
| `BACKEND_TEMPLATE.md` | Template implementasi backend |
| `SETUP_COMPLETE.md` | Setup guide & troubleshooting |

---

## 🎯 Key Features Implemented

### 1. ✅ Backend Configuration
- `NEXT_PUBLIC_API_BASE_URL` - configurable backend URL
- `NEXT_PUBLIC_ADMIN_URL` - admin dashboard URL
- Environment-based configuration

### 2. ✅ Backend Service (backendService.ts)
- `getAllProjects()`
- `getProjectById(id)`
- `getProjectsByYear(year)`
- `getProjectsByTag(tag)`
- `searchProjects(query)`
- `createProject(data)` - Admin
- `updateProject(id, updates)` - Admin
- `deleteProject(id)` - Admin
- `uploadProjectImage(file)` - Admin
- Token management
- Error handling & retry logic
- Request timeout handling

### 3. ✅ Authentication Service (authService.ts)
- `login(credentials)`
- `logout()`
- `refreshToken()`
- `getCurrentUser()`
- `changePassword(req)`
- Token storage & management
- Role checking (admin/editor)
- Token expiry detection

### 4. ✅ Frontend Hooks

**Project Hooks (useProjectsBackend.ts):**
- `useProjectsBackend(options)` - Generic fetch hook
- `useProjectBackend(id)` - Single project
- `useProjectsByYearBackend(year)` - Filter by year
- `useProjectsByTagBackend(tag)` - Filter by tag
- `useSearchProjects(query)` - Search
- `useCreateProject()` - Create (Admin)
- `useUpdateProject()` - Update (Admin)
- `useDeleteProject()` - Delete (Admin)
- `useUploadProjectImage()` - Upload (Admin)

**Auth Hooks (useAuth.ts):**
- `useLogin()` - Login with credentials
- `useLogout()` - Logout & cleanup
- `useAuth()` - Track auth status
- `useChangePassword()` - Change password
- `useRefreshToken()` - Refresh JWT token
- `usePermission()` - Check admin/editor role
- `useCurrentUser()` - Get current user data

### 5. ✅ Frontend API Routes (Proxy)

**GET /api/projects**
- Fetch semua atau filtered projects dari backend
- Query params: `id`, `year`, `tag`, `q`

**GET/PATCH/DELETE /api/projects/[id]**
- Single project operations
- Admin-only untuk PATCH/DELETE

### 6. ✅ Error Handling
- Network error handling
- Request retry logic
- Timeout handling (10 seconds default)
- Graceful fallback
- Error messages bubbled up

### 7. ✅ Security
- JWT token management
- Secure token storage (localStorage)
- Authorization headers
- Role-based access control
- Token expiry checking

---

## 🚀 How to Use

### For Public Portfolio (View Projects)

```typescript
// Automatically fetches from backend
import { useProjectsBackend } from '@/lib/hooks/useProjectsBackend';

export function Projects() {
  const { projects, loading, error } = useProjectsBackend();
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  
  return projects.map(p => <ProjectCard key={p.id} project={p} />);
}
```

### For Admin Dashboard (Manage Projects)

```typescript
// Login first
import { useLogin } from '@/lib/hooks/useAuth';

export function AdminLogin() {
  const { login } = useLogin();
  
  const handleLogin = async (email, password) => {
    const success = await login({ email, password });
    if (success) {
      // Redirect to admin panel
    }
  };
}

// Then use admin operations
import { useCreateProject, useUpdateProject, useDeleteProject } from '@/lib/hooks/useProjectsBackend';

export function AdminPanel() {
  const { createProject, loading } = useCreateProject();
  
  const handleCreate = async (data) => {
    const project = await createProject(data);
    if (project) {
      console.log('Project created:', project);
    }
  };
}
```

---

## 📋 Next Steps

### 1. Create Backend Server
Follow `BACKEND_TEMPLATE.md` untuk:
- Setup Express.js server
- Create MongoDB models
- Implement API endpoints
- Add JWT authentication

### 2. Update Frontend Components
Replace local data with backend hooks:
```typescript
// Old
import { PROJECTS } from '@/lib/projects';

// New
import { useProjectsBackend } from '@/lib/hooks/useProjectsBackend';
const { projects } = useProjectsBackend();
```

### 3. Setup Environment
Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001/admin
```

### 4. Test Integration
1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm run dev` (in frontend folder)
3. Test API calls
4. Test admin operations

### 5. Deploy
- Deploy backend to cloud (Railway, Render, etc)
- Deploy frontend to Vercel/Netlify
- Update environment variables

---

## 🔍 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Components                                                  │
│  ├── Home/Portfolio (Public)                                │
│  │   └── useProjectsBackend() → Backend API                 │
│  │                                                           │
│  └── Admin Dashboard (Protected)                            │
│      ├── useAuth() → Check permission                       │
│      └── useCreateProject/Update/Delete → Backend API       │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Frontend API Routes (Proxy)                                │
│  /api/projects → backendService → Backend                   │
│  /api/projects/[id]                                         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Services & Hooks                                           │
│  - backendService (API Client)                              │
│  - authService (Authentication)                             │
│  - useProjectsBackend (React Hooks)                         │
│  - useAuth (Auth Hooks)                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Express)                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  API Routes                                                 │
│  GET    /api/projects                                       │
│  GET    /api/projects/:id                                   │
│  POST   /api/projects (Admin)                               │
│  PATCH  /api/projects/:id (Admin)                           │
│  DELETE /api/projects/:id (Admin)                           │
│  POST   /api/auth/login                                     │
│  POST   /api/uploads/projects                               │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Controllers & Services                                     │
│  - projectController (CRUD logic)                           │
│  - authController (Authentication)                          │
│  - uploadService (File handling)                            │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  Middleware                                                 │
│  - JWT authentication                                       │
│  - Error handling                                           │
│  - CORS                                                     │
│  - Rate limiting                                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓ Query
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                       │
├─────────────────────────────────────────────────────────────┤
│  - Projects collection                                      │
│  - Users collection                                         │
│  - Uploads metadata                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation Files

| File | Untuk |
|------|-------|
| `BACKEND_INTEGRATION.md` | Developer setup & usage |
| `BACKEND_TEMPLATE.md` | Backend implementation |
| `SETUP_COMPLETE.md` | Complete guide & troubleshooting |
| `PROJECTS_API.md` | API documentation |
| `QUICK_START_PROJECTS.md` | Quick examples |

---

## ✅ Checklist

- [x] Backend configuration setup
- [x] API service client created
- [x] Authentication service created
- [x] Frontend hooks created
- [x] Frontend API routes created
- [x] Error handling implemented
- [x] Token management implemented
- [x] Documentation created
- [ ] Backend implementation (your part)
- [ ] Integration testing (your part)
- [ ] Production deployment (your part)

---

## 🎉 Ready to Go!

Sistem sudah siap untuk terhubung ke backend. Sekarang tinggal:

1. **Buat backend** - Ikuti `BACKEND_TEMPLATE.md`
2. **Update components** - Ganti local data dengan backend hooks
3. **Test** - Follow testing guide di `SETUP_COMPLETE.md`
4. **Deploy** - Deploy both frontend dan backend

Good luck! 🚀
