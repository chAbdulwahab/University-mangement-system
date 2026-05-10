import { useSelector } from 'react-redux';
import AdminDashboard from '../pages/admin/AdminDashboard';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';

const RoleDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    if (!user) return null;

    if (user.role === 'Admin') return <AdminDashboard />;
    if (user.role === 'Teacher') return <TeacherDashboard />;
    return <StudentDashboard />;
};

export default RoleDashboard;


