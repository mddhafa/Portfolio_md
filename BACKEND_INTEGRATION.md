# Backend Integration Guide

Panduan lengkap untuk mengintegrasikan portfolio frontend dengan admin dashboard backend.

## 🏗️ Architecture

```
Frontend (Portfolio) ──── REST API ──── Backend Admin Dashboard
   ├── Home/Projects
   ├── Services
   └── Skills
         │
         └──> /api/projects ──── Backend API
              /api/projects/[id]
              /api/upload
```

## 📦 File Structure Backend Integration

```
src/
├── lib/
│   ├── config.ts                    # Backend configuration
│   ├── services/
│   │   └── backendService.ts        # Backend API service
│   └── hooks/
│       ├── useProjects.ts           # Original hooks (fallback)
│       └── useProjectsBackend.ts    # Backend-connected hooks
│
└── app/
    └── api/
        └── projects/
            ├── route.ts             # GET /api/projects (proxy)
            └── [id]/route.ts        # GET/PATCH/DELETE /api/projects/[id]
```

## 🔧 Konfigurasi Backend

### 1. Setup Environment Variables

Create `.env.local` file:

```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Admin Dashboard URL (untuk link redirect)
NEXT_PUBLIC_ADMIN_URL=http://localhost:3001/admin
```

**Production Example:**
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_ADMIN_URL=https://admin.yourdomain.com
```

### 2. Backend API Requirements

Backend harus menyediakan endpoint berikut:

#### **GET /api/projects**
- Ambil semua projects
- Query params: `year`, `tag`, optional

```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "project-1",
      "title": "Project Title",
      "tag": "Frontend Dev",
      "year": "2024",
      "desc": "Description",
      "image": "https://...",
      "link": "https://...",
      "github": "https://...",
      "technologies": ["React", "TypeScript"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### **GET /api/projects/:id**
- Get single project by ID

#### **POST /api/projects** (Admin only)
- Create new project
- Requires Authorization header: `Bearer {token}`

```json
Request Body:
{
  "title": "New Project",
  "tag": "Frontend Dev",
  "year": "2024",
  "desc": "Description",
  "technologies": ["React"],
  "link": "https://...",
  "github": "https://..."
}
```

#### **PATCH /api/projects/:id** (Admin only)
- Update project
- Requires Authorization header

#### **DELETE /api/projects/:id** (Admin only)
- Delete project
- Requires Authorization header

#### **POST /api/uploads/projects** (Admin only)
- Upload project image
- Accepts form-data with `file` field
- Returns: `{ "success": true, "data": { "url": "https://..." } }`

#### **GET /api/projects/search?q=query**
- Search projects by title or description

## 🎯 Usage Examples

### Frontend Component (Using Backend)

```typescript
'use client';
import { useProjectsBackend } from '@/lib/hooks/useProjectsBackend';

export function ProjectsList() {
  const { projects, loading, error } = useProjectsBackend();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
          {project.image && <img src={project.image} alt={project.title} />}
        </div>
      ))}
    </div>
  );
}
```

### Filter by Year

```typescript
const { projects } = useProjectsByYearBackend('2024');
```

### Search Projects

```typescript
const { projects } = useSearchProjects('React');
```

### Admin: Create Project

```typescript
'use client';
import { useCreateProject } from '@/lib/hooks/useProjectsBackend';

export function CreateProjectForm() {
  const { createProject, loading, error } = useCreateProject();

  const handleCreate = async (formData) => {
    const newProject = await createProject(formData);
    if (newProject) {
      console.log('Project created:', newProject);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // Get form data and call handleCreate
    }}>
      {/* Form fields */}
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Admin: Update Project

```typescript
const { updateProject } = useUpdateProject();

const updated = await updateProject('project-id', {
  title: 'Updated Title',
  desc: 'Updated description'
});
```

### Admin: Delete Project

```typescript
const { deleteProject } = useDeleteProject();

const deleted = await deleteProject('project-id');
```

### Admin: Upload Image

```typescript
const { uploadImage } = useUploadProjectImage();

const imageUrl = await uploadImage(file);
```

## 🔐 Authentication

Backend authentication menggunakan JWT tokens disimpan di localStorage.

### Login Flow

```typescript
import { backendService } from '@/lib/services/backendService';

async function login(email: string, password: string) {
  // Call backend login endpoint
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    backendService.setAuthToken(data.token);
    return true;
  }
  return false;
}
```

### Logout

```typescript
backendService.clearAuthToken();
```

### Check Authentication

```typescript
if (backendService.isAuthenticated()) {
  // Show admin panel
}
```

## 🔄 Fallback to Local Data

Jika backend tidak tersedia, sistem dapat fall back ke local data:

```typescript
// Keep original projects.ts untuk fallback
import { PROJECTS } from '@/lib/projects';

// Use ini jika backend down
const projects = PROJECTS;
```

## 📝 Backend Implementation Example (Node.js/Express)

```javascript
// Example backend endpoint
app.get('/api/projects', async (req, res) => {
  try {
    const { year, tag } = req.query;
    
    let query = {};
    if (year) query.year = year;
    if (tag) query.tag = tag;
    
    const projects = await Project.find(query);
    
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    
    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});
```

## ✅ Deployment Checklist

- [ ] Backend API deployed dan accessible
- [ ] Environment variables configured di production
- [ ] CORS enabled di backend untuk frontend domain
- [ ] JWT secrets configured di backend
- [ ] Database backups configured
- [ ] Image upload storage configured (S3, Cloudinary, etc.)
- [ ] Error logging enabled
- [ ] Rate limiting configured
- [ ] Admin panel accessible dan secured

## 🚀 Next Steps

1. **Setup Backend** - Create admin dashboard backend
2. **Test API** - Test endpoints dengan Postman/Insomnia
3. **Connect Frontend** - Update components to use hooks
4. **Deploy** - Deploy both frontend dan backend
5. **Monitor** - Setup error tracking dan monitoring

---

**Questions?** Check `PROJECTS_API.md` untuk more details.
