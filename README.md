# 🎓 University Management System PRO

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen.svg)](https://university-mangement-system.vercel.app/)
[![Backend](https://img.shields.io/badge/backend-deployed-blue.svg)](https://ums-backend-uiuv.onrender.com)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)

A premium, full-stack University Management System (UMS) built with the MERN stack. Designed with a modern "Glassmorphism" aesthetic, featuring AI-driven insights, role-based access control, and a fully automated academic workflow.

---

## 🚀 Live Links
- **Frontend (Production)**: [https://university-mangement-system.vercel.app/](https://university-mangement-system.vercel.app/)
- **Backend API**: [https://ums-backend-uiuv.onrender.com/api](https://ums-backend-uiuv.onrender.com/api)

---

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@ums.com` | `admin123` |
| **Student** | `alice@ums.edu` | `123456` |
| **Faculty** | `john@ums.edu` | `123456` |

---

## ✨ Features

### 🛠️ Administrative Power
- **Full Control**: Manage Students, Faculty, Departments, and Courses from a unified dashboard.
- **Financial Tracking**: Real-time fee management and collection analytics.
- **System Seeding**: Automated database initialization with sample data.

### 👨‍🏫 Faculty Portal
- **Attendance Management**: Digital attendance tracking for assigned courses.
- **Grade Management**: Submit and update student marks and results.
- **Course Materials**: Upload and manage educational resources.

### 🎓 Student Experience
- **Personal Dashboard**: Track attendance, GPA, and upcoming assignments.
- **Online Enrollment**: Simple course registration process.
- **Fee Payment**: Integrated billing and payment history.

### 🤖 AI Integration
- **AI Chatbot**: Intelligent assistant available 24/7 to help students and faculty navigate the portal and answer academic queries.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Redux Toolkit, Tailwind CSS (Custom Design Tokens), Framer Motion (Animations).
- **Backend**: Node.js, Express.js, Socket.io (Real-time notifications).
- **Database**: MongoDB Atlas (Cloud Database).
- **Authentication**: JSON Web Token (JWT) with secure password hashing (Bcrypt).
- **Icons & UI**: Lucide-React, Glassmorphism UI components.

---

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chAbdulwahab/University-mangement-system.git
   ```

2. **Setup Backend**:
   ```bash
   cd server
   npm install
   # Create a .env file with MONGO_URI and JWT_SECRET
   npm run dev
   ```

3. **Setup Frontend**:
   ```bash
   cd client
   npm install
   # Create a .env file with VITE_API_URL
   npm run dev
   ```

4. **Initialize Database**:
   ```bash
   cd server
   node setup.js
   ```

---

## 📄 License
This project is licensed under the MIT License.

---

Developed with ❤️ by **Abdul Wahab**
