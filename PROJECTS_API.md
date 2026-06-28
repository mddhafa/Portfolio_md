# Projects API & Library Documentation

File ini memudahkan Anda untuk mengambil dan mengelola data project di website portfolio.

## File Structure

```
src/
├── lib/
│   └── projects.ts          # Project data & functions
└── app/
    └── api/
        └── projects/
            └── route.ts     # REST API endpoint
```

## 1. Using the Projects Library (`lib/projects.ts`)

### Import Projects Data

```typescript
import { PROJECTS, getAllProjects, getProjectById } from '@/lib/projects';
```

### Available Functions

#### **getAllProjects()** - Get semua project
```typescript
const allProjects = getAllProjects();
// Returns: Project[]
```

#### **getProjectById(id)** - Get project berdasarkan ID
```typescript
const project = getProjectById('bloom-studio');
// Returns: Project | undefined
```

#### **getProjectsByYear(year)** - Get project berdasarkan tahun
```typescript
const projects2024 = getProjectsByYear('2024');
// Returns: Project[]
```

#### **getProjectsByTag(tag)** - Get project berdasarkan tag
```typescript
const frontendProjects = getProjectsByTag('Frontend Dev');
// Returns: Project[]
```

#### **getProjectsSortedByYear()** - Get project sorted by year (terbaru duluan)
```typescript
const sorted = getProjectsSortedByYear();
// Returns: Project[] sorted by year descending
```

#### **getProjectYears()** - Get list unik tahun
```typescript
const years = getProjectYears();
// Returns: string[] ['2024', '2023', '2022']
```

#### **getProjectTags()** - Get list unik tags
```typescript
const tags = getProjectTags();
// Returns: string[] ['UI/UX', 'Dev', 'WordPress', ...]
```

## 2. Using the REST API

### Base URL
```
http://localhost:3000/api/projects
```

### Endpoints

#### **GET /api/projects** - Get semua project
```bash
curl http://localhost:3000/api/projects
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "bloom-studio",
      "title": "Bloom Studio",
      "tag": "UI/UX + Dev",
      "year": "2024",
      "desc": "...",
      "technologies": ["Figma", "React", "Tailwind CSS"],
      "link": "#",
      "github": "#"
    }
  ],
  "count": 6,
  "timestamp": "2024-06-13T..."
}
```

#### **GET /api/projects?id=bloom-studio** - Get project by ID
```bash
curl http://localhost:3000/api/projects?id=bloom-studio
```

#### **GET /api/projects?year=2024** - Get projects by year
```bash
curl http://localhost:3000/api/projects?year=2024
```

#### **GET /api/projects?tag=Frontend Dev** - Get projects by tag
```bash
curl http://localhost:3000/api/projects?tag=Frontend%20Dev
```

#### **GET /api/projects?sort=year** - Get projects sorted by year
```bash
curl http://localhost:3000/api/projects?sort=year
```

## 3. Contoh Penggunaan dalam Component

### Menggunakan Library (Client-Side)

```typescript
'use client';
import { useState, useEffect } from 'react';
import { getAllProjects } from '@/lib/projects';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const allProjects = getAllProjects();
    setProjects(allProjects);
  }, []);

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
          <span>{project.year}</span>
        </div>
      ))}
    </div>
  );
}
```

### Menggunakan API (Fetch)

```typescript
'use client';
import { useState, useEffect } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        const result = await response.json();
        
        if (result.success) {
          setProjects(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
          <span>{project.year}</span>
        </div>
      ))}
    </div>
  );
}
```

### Fetch Specific Projects

```typescript
// Get projects dari tahun 2024
const response = await fetch('/api/projects?year=2024');

// Get project berdasarkan ID
const response = await fetch('/api/projects?id=bloom-studio');

// Get projects dengan kategori Frontend Dev
const response = await fetch('/api/projects?tag=Frontend%20Dev');
```

## 4. Project Data Structure

```typescript
interface Project {
  id: string;                    // Unique identifier (kebab-case)
  title: string;                 // Project name
  tag: string;                   // Project category (e.g., "UI/UX + Dev")
  year: string;                  // Project year (e.g., "2024")
  desc: string;                  // Project description
  image?: string;                // Project image URL (optional)
  link?: string;                 // Project live link (optional)
  github?: string;               // GitHub repository link (optional)
  technologies?: string[];       // Tech stack used (optional)
}
```

## 5. Menambah Project Baru

Edit `src/lib/projects.ts` dan tambahkan ke array `PROJECTS`:

```typescript
{
  id: "my-new-project",
  title: "My New Project",
  tag: "Frontend Dev",
  year: "2024",
  desc: "Description of the project",
  technologies: ["React", "TypeScript"],
  link: "https://...",
  github: "https://..."
}
```

---

**Catatan:** File ini sudah terintegrasi dengan `/page.tsx`. Anda bisa mengupdate component untuk menggunakan data dari `lib/projects.ts` agar lebih modular dan maintainable.
