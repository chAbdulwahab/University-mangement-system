import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsManagement from './pages/admin/StudentsManagement';
import CoursesManagement from './pages/admin/CoursesManagement';
import TeachersManagement from './pages/admin/TeachersManagement';
import DepartmentsManagement from './pages/admin/DepartmentsManagement';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import AttendanceManagement from './pages/teacher/AttendanceManagement';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import MarksManagement from './pages/teacher/MarksManagement';
import Assignments from './pages/teacher/Assignments';
import CourseMaterials from './pages/teacher/CourseMaterials';
import TeacherProfile from './pages/teacher/TeacherProfile';
import FinanceManagement from './pages/admin/FinanceManagement';
import Results from './pages/student/Results';
import StudentDashboard from './pages/student/StudentDashboard';
import EnrollCourses from './pages/student/EnrollCourses';
import AttendanceView from './pages/student/AttendanceView';
import Fees from './pages/student/Fees';
import StudentAssignments from './pages/student/Assignments';
import StudentProfile from './pages/student/StudentProfile';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import RoleDashboard from './components/RoleDashboard';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <div className="min-h-screen bg-background text-text transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
              <Route path="/" element={<RoleDashboard />} />
              
              {/* Admin Shared Routes */}
              <Route path="/students" element={<StudentsManagement />} />
              <Route path="/courses" element={<CoursesManagement />} />
              <Route path="/teachers" element={<TeachersManagement />} />
              <Route path="/departments" element={<DepartmentsManagement />} />
              <Route path="/finance" element={<FinanceManagement />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />

              {/* Teacher Shared Routes */}
              <Route path="/attendance" element={<AttendanceManagement />} />
              <Route path="/marks" element={<MarksManagement />} />
              <Route path="/assignments" element={<Assignments />} />
              <Route path="/materials" element={<CourseMaterials />} />
              <Route path="/teacher-profile" element={<TeacherProfile />} />

              {/* Student Shared Routes */}
              <Route path="/enroll" element={<EnrollCourses />} />
              <Route path="/attendance-view" element={<AttendanceView />} />
              <Route path="/results" element={<Results />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/student-assignments" element={<StudentAssignments />} />
              <Route path="/student-profile" element={<StudentProfile />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;


