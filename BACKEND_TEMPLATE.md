# Backend Admin Dashboard - Implementation Checklist

Template untuk membangun backend admin dashboard untuk mengelola projects.

## 🎯 Project Structure Recommendation

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Database connection
│   │   └── cors.ts              # CORS configuration
│   ├── models/
│   │   └── Project.ts           # Project model/schema
│   ├── controllers/
│   │   ├── projectController.ts # Project CRUD logic
│   │   └── authController.ts    # Authentication
│   ├── routes/
│   │   ├── projects.ts          # Project routes
│   │   ├── auth.ts              # Auth routes
│   │   └── uploads.ts           # Upload routes
│   ├── middleware/
│   │   ├── authenticate.ts      # JWT auth middleware
│   │   └── errorHandler.ts      # Error handling
│   ├── services/
│   │   ├── projectService.ts    # Business logic
│   │   └── uploadService.ts     # File upload service
│   └── app.ts                   # Express app setup
├── .env                         # Environment variables
├── .env.example                 # Example env
└── package.json
```

## 📋 Core Models

### Project Model

```typescript
interface ProjectDocument {
  _id: ObjectId;
  title: string;
  tag: string;
  year: string;
  desc: string;
  image?: string;
  link?: string;
  github?: string;
  technologies?: string[];
  slug?: string;
  views?: number;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### User/Admin Model

```typescript
interface AdminUser {
  _id: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'editor';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔌 API Endpoints to Implement

### Projects Endpoints

```
GET    /api/projects              - Get all projects
GET    /api/projects?year=2024    - Filter by year
GET    /api/projects?tag=xxx      - Filter by tag
GET    /api/projects/search?q=xxx - Search projects
GET    /api/projects/:id          - Get single project
POST   /api/projects              - Create project (Admin)
PATCH  /api/projects/:id          - Update project (Admin)
DELETE /api/projects/:id          - Delete project (Admin)
```

### Authentication Endpoints

```
POST   /api/auth/login            - Admin login
POST   /api/auth/logout           - Admin logout
POST   /api/auth/refresh          - Refresh token
GET    /api/auth/me               - Get current admin
```

### Upload Endpoints

```
POST   /api/uploads/projects      - Upload project image
DELETE /api/uploads/:id           - Delete uploaded image
```

## 📦 Required Dependencies (Node.js/Express)

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5",
    "cloudinary": "^1.32.0",
    "express-validator": "^7.0.0",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^18.0.0",
    "typescript": "^5.0.0",
    "ts-node": "^10.0.0"
  }
}
```

## 🔐 Authentication & Security

### JWT Implementation

```typescript
// Generate token
const token = jwt.sign(
  { userId: admin._id, email: admin.email },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Middleware
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No token' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}
```

### Password Security

```typescript
// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password
const isMatch = await bcrypt.compare(password, hashedPassword);
```

## 📸 File Upload Setup

### Using Cloudinary (Recommended)

```typescript
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload
const result = await cloudinary.uploader.upload(filePath);
```

### Or Using Local Storage + Multer

```typescript
import multer from 'multer';

const upload = multer({
  dest: 'uploads/projects/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'));
    }
  }
});

app.post('/api/uploads/projects', upload.single('file'), (req, res) => {
  // Handle file
});
```

## 🗄️ Database Setup (MongoDB)

### Connection

```typescript
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});
```

### Project Schema Example

```typescript
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tag: { type: String, required: true },
    year: { type: String, required: true },
    desc: { type: String, required: true },
    image: String,
    link: String,
    github: String,
    technologies: [String],
    slug: { type: String, unique: true },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
```

## 💻 Sample Controller (Express + MongoDB)

```typescript
// Create Project
export async function createProject(req, res) {
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
}

// Get All Projects
export async function getAllProjects(req, res) {
  try {
    const { year, tag, search } = req.query;
    
    let filter = {};
    if (year) filter.year = year;
    if (tag) filter.tag = tag;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { desc: { $regex: search, $options: 'i' } }
      ];
    }
    
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: projects,
      count: projects.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

// Update Project
export async function updateProject(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
}

// Delete Project
export async function deleteProject(req, res) {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

## 🚀 Environment Variables (.env)

```bash
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/portfolio

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

## 📝 Quick Start Backend (Express + MongoDB)

1. **Initialize project**
   ```bash
   npm init -y
   npm install express mongoose cors dotenv jsonwebtoken bcryptjs
   ```

2. **Create .env file** with above variables

3. **Create `src/app.ts`**
   ```typescript
   import express from 'express';
   import cors from 'cors';
   
   const app = express();
   
   app.use(cors({ origin: process.env.CORS_ORIGIN }));
   app.use(express.json());
   
   // Routes
   app.use('/api/projects', projectRoutes);
   app.use('/api/auth', authRoutes);
   
   export default app;
   ```

4. **Create `src/server.ts`**
   ```typescript
   import mongoose from 'mongoose';
   import app from './app';
   
   mongoose.connect(process.env.MONGODB_URI);
   
   app.listen(process.env.PORT || 3001, () => {
     console.log(`Server running on port ${process.env.PORT}`);
   });
   ```

5. **Run**
   ```bash
   npx ts-node src/server.ts
   ```

## 🧪 Testing Endpoints

### Using cURL

```bash
# Get all projects
curl http://localhost:3001/api/projects

# Create project (with auth)
curl -X POST http://localhost:3001/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"New Project","tag":"Frontend Dev",...}'

# Update project
curl -X PATCH http://localhost:3001/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Updated Title"}'

# Delete project
curl -X DELETE http://localhost:3001/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
- Create collection
- Add requests untuk setiap endpoint
- Set authorization header dengan Bearer token
- Test all CRUD operations

## ✅ Deployment Options

- **Heroku** - Easy deployment, free tier available
- **Railway** - Similar to Heroku, good for Node.js
- **Vercel** - For serverless functions
- **AWS EC2** - Full control, more expensive
- **DigitalOcean** - VPS, affordable
- **Render** - Modern alternative to Heroku

## 📚 Recommended Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [JWT Authentication Guide](https://jwt.io/introduction)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Upload API](https://cloudinary.com/documentation)

---

Gunakan template ini sebagai starting point untuk backend Anda!
