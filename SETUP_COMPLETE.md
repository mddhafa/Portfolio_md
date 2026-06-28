# Complete Backend Integration Setup Guide

Panduan lengkap untuk setup dan testing backend integration untuk portfolio.

## 🚀 Quick Setup (5 menit)

### 1. Copy Environment File
```bash
cp .env.example .env.local
```

### 2. Edit `.env.local`
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001/admin
```

### 3. Start Frontend
```bash
npm run dev
```

Sekarang frontend siap terhubung ke backend!

---

## 📁 File Structure Overview

```
Frontend (Next.js)
├── src/
│   ├── lib/
│   │   ├── config.ts                    ✅ Backend configuration
│   │   ├── projects.ts                  📦 Local fallback data
│   │   ├── services/
│   │   │   ├── backendService.ts        ✅ Backend API client
│   │   │   └── authService.ts           ✅ Authentication
│   │   └── hooks/
│   │       ├── useProjects.ts           📦 Original hooks
│   │       ├── useProjectsBackend.ts    ✅ Backend-connected hooks
│   │       └── useAuth.ts               ✅ Auth hooks
│   └── app/
│       └── api/
│           └── projects/
│               ├── route.ts             ✅ Proxy GET /POST
│               └── [id]/route.ts        ✅ GET/PATCH/DELETE
│
├── .env.example                         ✅ Environment template
├── .env.local                           🔒 Local config (not in git)
├── BACKEND_INTEGRATION.md               📖 Integration guide
├── BACKEND_TEMPLATE.md                  📖 Backend implementation
└── QUICK_START_PROJECTS.md              📖 Quick start
```

---

## 🔧 Configuration Options

### Option 1: Using Backend API Only (Recommended)

**Frontend connects to backend for all data**

```typescript
import { useProjectsBackend } from '@/lib/hooks/useProjectsBackend';

// Always fetches from backend
const { projects } = useProjectsBackend();
```

**Pros:**
- Single source of truth
- Easy admin management
- Real-time updates
- Scalable

**Cons:**
- Depends on backend availability
- Need backend deployed

### Option 2: Fallback to Local Data

**Frontend tries backend, falls back to local data if unavailable**

```typescript
import { useProjectsBackend } from '@/lib/hooks/useProjectsBackend';
import { PROJECTS } from '@/lib/projects';

const { projects, loading, error } = useProjectsBackend();

// Fallback to local data if error
const displayProjects = error ? PROJECTS : projects;
```

**Pros:**
- Works offline
- No hard dependency on backend
- Good UX if backend is down

**Cons:**
- Data duplication
- Harder to sync

### Option 3: Hybrid Approach

**Different endpoints use different strategies**

```typescript
// Portfolio homepage: Use backend + fallback
const publicProjects = useProjectsBackend(); // with fallback

// Admin dashboard: Backend only
const adminProjects = useProjectsBackend(); // no fallback
```

---

## 🎯 Integration Steps

### Step 1: Update Frontend Components

**Before (using local data):**
```typescript
import { PROJECTS } from '@/lib/projects';

export function ProjectList() {
  return (
    <div>
      {PROJECTS.map(project => (...))}
    </div>
  );
}
```

**After (using backend):**
```typescript
import { useProjectsBackend } from '@/lib/hooks/useProjectsBackend';

export function ProjectList() {
  const { projects, loading, error } = useProjectsBackend();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {projects.map(project => (...))}
    </div>
  );
}
```

### Step 2: Setup Admin Authentication

```typescript
'use client';
import { useLogin } from '@/lib/hooks/useAuth';
import { useState } from 'react';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      // Redirect to admin dashboard
      window.location.href = '/admin';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="Email"
      />
      <input 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Step 3: Create Admin Dashboard

```typescript
'use client';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCreateProject, useUpdateProject, useDeleteProject } from '@/lib/hooks/useProjectsBackend';

export function AdminDashboard() {
  const { isAuthenticated, user } = useAuth();
  const { createProject, loading } = useCreateProject();

  if (!isAuthenticated) {
    return <p>Not authenticated</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome {user?.name}</p>
      
      {/* Create form, project list, edit forms, etc */}
    </div>
  );
}
```

### Step 4: Setup Backend

Follow `BACKEND_TEMPLATE.md` untuk:
- Setup Express server
- Create MongoDB models
- Implement API endpoints
- Add authentication

### Step 5: Deploy Both

**Frontend:**
```bash
npm run build
npm run start
# atau deploy ke Vercel/Netlify
```

**Backend:**
- Deploy ke Railway, Render, Heroku, atau server lain
- Configure database (MongoDB Atlas)
- Set environment variables

---

## 🧪 Testing Guide

### 1. Test Frontend Without Backend

**Gunakan local data:**
```typescript
import { PROJECTS } from '@/lib/projects';

// Component works dengan local data
```

### 2. Test Frontend with Mock Backend

**Use fetch interceptor untuk mock API:**
```typescript
// src/lib/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json({
      success: true,
      data: PROJECTS
    });
  }),
];
```

### 3. Test with Real Backend

**Start local backend:**
```bash
cd backend
npm run dev
# Backend running on http://localhost:3001
```

**Test endpoints dengan cURL:**
```bash
# Get all projects
curl http://localhost:3001/api/projects

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

**Test from frontend:**
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:3000
# Automatically uses backend via API_CONFIG
```

### 4. Testing with Postman

1. Import collection
2. Set base URL: `{{BASE_URL}}`
3. Add environment variable: `BASE_URL=http://localhost:3001`
4. Set auth token: `{{AUTH_TOKEN}}`
5. Run requests

---

## 🔐 Security Checklist

- [ ] Environment variables not committed to git
- [ ] `.env.local` in `.gitignore`
- [ ] JWT tokens stored securely (localStorage ok for frontend)
- [ ] CORS configured properly in backend
- [ ] Password hashed with bcrypt
- [ ] Rate limiting enabled
- [ ] Input validation on both frontend and backend
- [ ] HTTPS in production
- [ ] Environment secrets not exposed in client code
- [ ] Admin routes protected with authentication

---

## 📊 Monitoring & Logging

### Frontend Logging

```typescript
import { backendService } from '@/lib/services/backendService';

// Log API errors
try {
  const result = await backendService.getAllProjects();
  if (!result.success) {
    console.error('API Error:', result.error);
    // Send to monitoring service
    sendToSentry(result.error);
  }
} catch (error) {
  console.error('Network Error:', error);
  sendToSentry(error);
}
```

### Backend Logging

```typescript
// src/middleware/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Use in routes
logger.info('Project created', { projectId: project._id });
logger.error('Database error', { error: error.message });
```

---

## 🚀 Production Deployment

### Frontend (Vercel)

```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys
# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

### Backend (Railway/Render)

1. Connect GitHub repo
2. Set environment variables:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=...
   CORS_ORIGIN=https://yourdomain.com
   ```
3. Deploy and test

### Database (MongoDB Atlas)

1. Create cluster
2. Add IP whitelist
3. Create database user
4. Copy connection string
5. Use in backend `.env`

---

## 🐛 Troubleshooting

### "Failed to fetch projects"

**Possible causes:**
1. Backend not running
2. CORS not configured
3. Incorrect API URL in `.env.local`
4. Network error

**Solution:**
```bash
# Check backend is running
curl http://localhost:3001/api/projects

# Check CORS headers
curl -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS http://localhost:3001/api/projects

# Check frontend API config
console.log(API_CONFIG.baseUrl)
```

### "Unauthorized" error

**Possible causes:**
1. Token expired
2. Token not sent in header
3. Invalid token format
4. Backend secret mismatch

**Solution:**
```typescript
// Check if authenticated
console.log(authService.isAuthenticated());
console.log(authService.getToken());

// Try refresh token
const refreshed = await authService.refreshToken();

// Re-login if needed
await authService.login(credentials);
```

### Backend returns 500 error

**Check backend logs:**
```bash
# Docker logs
docker logs backend-container

# File logs
tail -f backend/logs/error.log

# Database connection
mongosh "mongodb+srv://..."
```

---

## 📚 Additional Resources

- **Backend Setup**: `BACKEND_TEMPLATE.md`
- **Integration Details**: `BACKEND_INTEGRATION.md`
- **Project Management**: `PROJECTS_API.md`
- **Quick Start**: `QUICK_START_PROJECTS.md`

---

## ❓ FAQs

**Q: Do I need to keep `src/lib/projects.ts`?**
A: No, tapi bagus untuk fallback jika backend down.

**Q: Bagaimana cara update project data?**
A: Gunakan admin dashboard yang terhubung ke backend. Data otomatis sinkron.

**Q: Apakah ada rate limiting?**
A: Backend bisa set rate limiting. Frontend automatically retry jika failed.

**Q: Bagaimana deploy di production?**
A: Follow "Production Deployment" section di atas.

**Q: Bagaimana kalau backend offline?**
A: Frontend tetap jalan dengan fallback data, tapi limited functionality.

---

**Siap untuk deploy?** Ikuti steps di section "Production Deployment"! 🎉
