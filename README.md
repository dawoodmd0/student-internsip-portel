# Student Internship Portal – Full Stack Web Application

A full-stack responsive web application engineered using **React.js, Node.js, Express.js, and MongoDB (Mongoose)**. The portal enables students to browse verified internship opportunities, view comprehensive role requirements, and submit applications directly through an intuitive, validated application form.

---

## 🚀 Live Demo & Repository Links

- **GitHub Repository URL:** `https://github.com/dawoodmd0/student-internsip-portel`
- **Frontend Deployment (Vercel):** `https://student-internship-portal-client.vercel.app` *(Replace with your deployed Vercel URL)*
- **Backend API URL (Render):** `https://student-internship-portal-api.onrender.com` *(Replace with your deployed Render URL)*

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM v6, Fetch API, Modern CSS3 |
| **Backend** | Node.js, Express.js (REST API), CORS, Dotenv |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Version Control** | Git, GitHub (`main` & `rollno_v1` branches) |
| **Cloud Hosting** | Vercel (Frontend SPA), Render (Backend Node API) |

---

## 📁 Project Directory Structure

```text
student-internship-portal/
│
├── frontend/                     # React.js client application (Vite)
│   ├── public/                   # Static assets & favicon
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Navbar.jsx        # Responsive navigation with mobile menu
│   │   │   ├── Footer.jsx        # Footer with platform info & status
│   │   │   ├── InternshipCard.jsx# Card for role title, stipend, skills
│   │   │   ├── Loader.jsx        # Animated loading spinner
│   │   │   └── AlertBanner.jsx   # Feedback banner for errors/success
│   │   ├── pages/                # Page views
│   │   │   ├── HomePage.jsx      # Search, filter & list internships
│   │   │   ├── InternshipDetailsPage.jsx # Full specifications & apply CTA
│   │   │   ├── ApplicationFormPage.jsx   # Form with validation & fetch API
│   │   │   ├── ApplicationsListPage.jsx  # View submitted applications
│   │   │   └── NotFoundPage.jsx  # 404 handler
│   │   ├── services/
│   │   │   └── api.js            # Native Fetch API abstraction
│   │   ├── App.jsx               # React Router routes & master layout
│   │   ├── App.css               # Modern responsive design system
│   │   └── main.jsx              # React root entry point
│   ├── index.html                # HTML document with Google Fonts
│   ├── vercel.json               # SPA route rewrites for Vercel
│   ├── vite.config.js            # Vite configuration & dev proxy
│   ├── package.json              # Frontend dependencies
│   ├── .env                      # Local environment variable (VITE_API_URL)
│   └── .env.example              # Template for frontend environment
│
├── backend/                      # Node.js + Express REST API
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler via Mongoose
│   ├── models/
│   │   ├── Internship.js         # Mongoose schema for internship openings
│   │   └── Application.js        # Mongoose schema for student applications
│   ├── controllers/
│   │   ├── internshipController.js # CRUD handlers & initial mock seed data
│   │   └── applicationController.js# Application validation & submission
│   ├── routes/
│   │   ├── internshipRoutes.js   # /api/internships endpoints
│   │   └── applicationRoutes.js  # /api/applications endpoints
│   ├── seed.js                   # Standalone database seeder script
│   ├── server.js                 # Express server configuration & middleware
│   ├── package.json              # Backend dependencies
│   ├── .env                      # Local environment variables (PORT, MONGO_URI)
│   └── .env.example              # Template for backend environment
│
├── Dockerfile                    # Multi-stage production container build
├── .dockerignore                 # Excludes node_modules & secrets from image
├── .gitignore                    # Git ignore file for secrets and dependencies
├── package.json                  # Root runner script (concurrently)
└── README.md                     # Comprehensive documentation & setup guide
```

---

## ⚙️ Environment Configuration

### 1. Backend (`backend/.env`)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/internship_portal?retryWrites=true&w=majority
CORS_ORIGIN=*
```

> **Note:** Replace `<username>` and `<password>` with your MongoDB Atlas database user credentials. Never commit this file to Git.

### 2. Frontend (`frontend/.env`)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

> In production on Vercel, set `VITE_API_URL` to your live Render backend URL (e.g. `https://student-internship-portal-api.onrender.com`).

---

## 📦 Local Installation & Setup

### Option A: Quick Monorepo Launch (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dawoodmd0/student-internsip-portel.git
   cd student-internsip-portel
   ```

2. **Install all dependencies (Root, Backend & Frontend):**
   ```bash
   npm run install:all
   ```

3. **Start both Backend & Frontend concurrently:**
   ```bash
   npm run dev
   ```
   - **Frontend:** `http://localhost:5173`
   - **Backend API:** `http://localhost:5000`

---

### Option B: Running Separately

#### 1. Start the Backend API:
```bash
cd backend
npm install
npm run dev
```
*(Server will start on `http://localhost:5000`)*

#### 2. Seed Sample Internships (Optional):
```bash
cd backend
npm run seed
```
*(Automatically inserts 6+ verified tech internship opportunities)*

#### 3. Start the Frontend React App:
```bash
cd frontend
npm install
npm run dev
```
*(Vite dev server will start on `http://localhost:5173`)*

---

## 📡 RESTful API Documentation

| Method | Endpoint | Description | Request Body / Query | Status Code |
|---|---|---|---|---|
| `GET` | `/api/internships` | Retrieve all internships | `?search=react&type=Remote` (Optional) | `200 OK` |
| `GET` | `/api/internships/:id` | Retrieve single internship details | None | `200 OK` / `404 Not Found` |
| `POST` | `/api/internships/seed`| Re-seed database with sample opportunities | None | `201 Created` |
| `POST` | `/api/applications` | Submit student application | `{ studentName, email, rollNumber, internshipId }` | `201 Created` / `400 Bad Request` / `409 Conflict` |
| `GET` | `/api/applications` | Retrieve all student applications | None | `200 OK` |
| `GET` | `/api/health` | Service health status check | None | `200 OK` |

### Sample JSON Payloads

#### 1. Submit Application (`POST /api/applications`)
```json
{
  "studentName": "Alex Rivera",
  "email": "alex.rivera@university.edu",
  "rollNumber": "21BCE1045",
  "internshipId": "654321abcdef1234567890ab"
}
```

#### 2. Success Response (`201 Created`)
```json
{
  "success": true,
  "message": "Application submitted successfully! Our team will review your application soon.",
  "data": {
    "_id": "672465ab0192837465f12345",
    "studentName": "Alex Rivera",
    "email": "alex.rivera@university.edu",
    "rollNumber": "21BCE1045",
    "internshipId": {
      "_id": "654321abcdef1234567890ab",
      "title": "Full Stack Web Developer Intern",
      "company": "Innovatech Solutions",
      "location": "Remote",
      "stipend": "₹20,000 / month"
    },
    "createdAt": "2026-11-01T20:30:00.000Z"
  }
}
```

---

## 🗄️ Database Schemas (Mongoose)

### 1. Application Schema
```javascript
const applicationSchema = new mongoose.Schema({
    studentName: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    rollNumber: { type: String, required: true, trim: true },
    internshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Internship',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
```

### 2. Internship Schema
```javascript
const internshipSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    stipend: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    eligibility: { type: String, required: true, trim: true },
    skills: { type: [String], default: [] },
    type: { type: String, enum: ['Remote', 'Hybrid', 'In-Office'], default: 'Remote' },
    deadline: { type: String, default: 'Rolling basis' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
```

---

## 🌿 Git & GitHub Workflow Execution

Follow these exact Git commands executed for this submission:

```bash
# 1. Initialize or check branch status
git status

# 2. Create and switch to the development branch
git checkout -b rollno_v1

# 3. Stage all implemented files
git add .

# 4. Commit all changes with a meaningful message
git commit -m "feat: complete Student Internship Portal with React frontend, Express REST API, and MongoDB integration"

# 5. Switch to the main branch
git checkout main

# 6. Merge the rollno_v1 branch into main
git merge rollno_v1

# 7. Push the updated main branch to GitHub
git push -u origin main

# 8. Push the rollno_v1 branch for evaluation
git push -u origin rollno_v1
```

---

## ☁️ Deployment Instructions

### A. Backend Deployment on Render

1. Create a free account at [render.com](https://render.com).
2. Click **New +** and choose **Web Service**.
3. Connect your GitHub repository: `https://github.com/dawoodmd0/student-internsip-portel`.
4. Configure the service settings:
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Under **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `your_mongodb_atlas_connection_string`
   - `CORS_ORIGIN`: `*` (or your Vercel domain once deployed)
6. Click **Deploy Web Service** and copy your live backend URL (e.g. `https://student-internship-portal-api.onrender.com`).

---

### B. Frontend Deployment on Vercel

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project** and select your GitHub repository.
3. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Click edit and choose `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://student-internship-portal-api.onrender.com`)
5. Notice that `frontend/vercel.json` already contains the SPA routing configuration to handle client-side routing on page refreshes:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Click **Deploy**. Your student portal is now live with global edge caching!

---

## ✨ Features & Verification Checklist

- [x] **Home / Listing Page:** Displays verified internships with company name, location, duration, stipend, tags, and search/filter.
- [x] **Internship Details Page:** Displays complete role description, eligibility requirements, technical skills, and Apply CTA.
- [x] **Application Form:** Auto-populates selected internship, validates student name, roll number, and email format.
- [x] **Duplicate Prevention:** Disables submit button during processing (`isSubmitting`) and prevents duplicate submissions per roll number in MongoDB.
- [x] **Applications Registry:** Displays all submitted applications stored in MongoDB.
- [x] **Error Handling:** Graceful banners for network failures, validation errors, and invalid ObjectIds.
- [x] **Responsive Design:** Optimized for desktops, tablets, and mobile screens.
- [x] **Docker Support:** Multi-stage production container build ready.
