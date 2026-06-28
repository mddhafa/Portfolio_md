# Quick Start Guide - Projects API

Panduan cepat untuk menggunakan projects API dan library yang sudah dibuat.

## ⚡ 3 Cara Menggunakan Projects

### **Cara 1: Import Data Langsung (Paling Simple)**

```typescript
'use client';
import { PROJECTS } from '@/lib/projects';

export default function ProjectList() {
  return (
    <div>
      {PROJECTS.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
        </div>
      ))}
    </div>
  );
}
```

### **Cara 2: Gunakan Utility Functions**

```typescript
'use client';
import { getAllProjects, getProjectsByYear } from '@/lib/projects';

export default function ProjectList() {
  const allProjects = getAllProjects();
  const recent2024 = getProjectsByYear('2024');

  return (
    <div>
      <h2>Total Projects: {allProjects.length}</h2>
      <h3>Projects 2024: {recent2024.length}</h3>
    </div>
  );
}
```

### **Cara 3: Gunakan Custom Hooks (Recommended)**

```typescript
'use client';
import { useProjects, useProjectsByYear } from '@/lib/hooks/useProjects';

export default function ProjectList() {
  const { projects, loading, error } = useProjects();
  const { projects: recent } = useProjectsByYear('2024');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>All Projects ({projects.length})</h2>
      <h3>2024 Projects ({recent.length})</h3>
    </div>
  );
}
```

### **Cara 4: Fetch dari API**

```typescript
'use client';
import { useEffect, useState } from 'react';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📌 API Endpoints Quick Reference

| Endpoint | Parameter | Description |
|----------|-----------|-------------|
| `/api/projects` | - | Get semua projects |
| `/api/projects` | `?id=bloom-studio` | Get project by ID |
| `/api/projects` | `?year=2024` | Get projects dari tahun 2024 |
| `/api/projects` | `?tag=Frontend%20Dev` | Get projects dengan tag tertentu |
| `/api/projects` | `?sort=year` | Get projects sorted by year |

## 🎯 Common Use Cases

### 1. Display Recent Projects (2024)
```typescript
import { getProjectsByYear } from '@/lib/projects';

const recent = getProjectsByYear('2024');
```

### 2. Get Unique Years for Filter
```typescript
import { getProjectYears } from '@/lib/projects';

const years = getProjectYears(); // ['2024', '2023', '2022']
```

### 3. Get Unique Tags for Filter
```typescript
import { getProjectTags } from '@/lib/projects';

const tags = getProjectTags(); // ['UI/UX', 'Frontend Dev', 'WordPress']
```

### 4. Show Single Project Detail
```typescript
import { useProject } from '@/lib/hooks/useProjects';

const { project } = useProject('bloom-studio');
```

## 📁 File Locations

- **Data**: `src/lib/projects.ts`
- **API**: `src/app/api/projects/route.ts`
- **Hooks**: `src/lib/hooks/useProjects.ts`
- **Examples**: `src/components/ProjectExamples.tsx`
- **Docs**: `PROJECTS_API.md`

## ✅ Next Steps

1. **Integrate dengan Component** - Update `src/app/page.tsx` untuk menggunakan data dari `lib/projects.ts`
2. **Add Filter UI** - Buat filter berdasarkan tahun atau tag
3. **Create Detail Page** - Buat halaman detail untuk setiap project
4. **Add Images** - Tambahkan `image` URL di setiap project data
5. **Connect Links** - Update `link` dan `github` URLs

---

**Need more info?** Lihat `PROJECTS_API.md` untuk dokumentasi lengkap.
