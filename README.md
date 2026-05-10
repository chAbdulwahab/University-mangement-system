# 🏛️ EduNexus: Enterprise University Management System

![EduNexus Banner](C:\Users\abdul\.gemini\antigravity\brain\3339c4eb-f8b2-423f-aa46-18ec171d9f25\university_management_banner_1778391463811.png)

## 🌟 Overview

**EduNexus** is a state-of-the-art, full-stack University Management System (UMS) built on the **MERN** stack. Designed for modern educational institutions, it provides a seamless, integrated platform for administrators, faculty, and students to manage academic and administrative workflows with precision and ease.

With a focus on **visual excellence**, **real-time interactivity**, and **secure data management**, EduNexus transforms the traditional educational experience into a digital-first ecosystem.

---

## 🚀 Key Features

### 🛡️ Admin Powerhouse
- **360° Analytics**: Real-time data visualization of student enrollment, financial health, and academic performance using **Recharts**.
- **Financial Orchestration**: Comprehensive fee management, scholarship tracking, and automated payment verification.
- **Resource Management**: Effortless handling of Departments, Courses, Faculty, and Student records.
- **Global Search**: Instantly find any record across the entire institution.

### 👨‍🏫 Faculty Command Center
- **Smart Attendance**: Rapid digital attendance marking and historical tracking.
- **Assignment Engine**: Create, distribute, and grade assignments with automated feedback loops.
- **Material Hub**: Securely upload and share course materials via **Cloudinary**.
- **Gradebook**: Centralized marks management with automatic GPA calculations.

### 🎓 Student Portal
- **Interactive Dashboard**: Personalized view of schedules, upcoming deadlines, and academic progress.
- **Seamless Payments**: View fee structures and track payment history.
- **Academic Progress**: Instant access to results, attendance percentages, and enrolled courses.
- **Submission Portal**: Digital assignment submission with real-time status updates.

---

## 🛠️ Tech Stack

### Frontend
- **React 19**: Utilizing the latest concurrent features for high-performance rendering.
- **Tailwind CSS v4**: Ultra-modern, utility-first styling with a custom design system.
- **Framer Motion**: Smooth, cinematic transitions and micro-interactions.
- **Redux Toolkit**: Robust global state management.
- **Lucide & React Icons**: Crisp, professional iconography.

### Backend
- **Node.js & Express**: High-concurrency server architecture.
- **MongoDB & Mongoose**: Scalable NoSQL database with strict schema modeling.
- **Socket.io**: Powering real-time notifications and live updates.
- **Cloudinary**: High-performance media storage for assignments and materials.
- **JWT & Bcrypt**: Industry-standard security and authentication.

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account
- Cloudinary account

### Step 1: Clone the Repository
```bash
git clone https://github.com/chAbdulwahab/University-mangement-system.git
cd University-mangement-system
```

### Step 2: Server Configuration
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Client Configuration
```bash
cd ../client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Launch the Application
**Run Server:**
```bash
cd server
npm run dev
```
**Run Client:**
```bash
cd client
npm run dev
```

---

## 📂 Project Structure

```text
EduNexus/
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Role-specific dashboard views
│   │   ├── redux/         # State management slices
│   │   └── assets/        # Global styles and images
├── server/                # Backend Express API
│   ├── models/            # Mongoose data schemas
│   ├── routes/            # API endpoints
│   ├── controllers/       # Business logic
│   └── middleware/        # Auth & validation guards
└── README.md
```

---

## 🎨 UI Aesthetics
EduNexus features a **Premium Glassmorphic Design** with:
- Dynamic Dark Mode support.
- Responsive layouts for Mobile, Tablet, and Desktop.
- Smooth hover effects and page transitions.
- High-contrast, accessible typography.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ for better education.
</p>
