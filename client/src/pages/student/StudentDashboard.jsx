import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Award, CreditCard, Clock, Bell, MapPin, User as UserIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { getProfile } from '../../redux/authSlice';

const StudentDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [assignments, setAssignments] = useState([]);
    const [lectures, setLectures] = useState([]);
    const [attendanceStats, setAttendanceStats] = useState({ percentage: '0%', status: 'Pending' });
    const [feeStatus, setFeeStatus] = useState('Pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(getProfile());
        fetchData();
    }, [dispatch]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [assignRes, lectureRes, attendanceRes, feeRes] = await Promise.all([
                axios.get('/api/academic/assignments', config),
                axios.get('/api/academic/lectures/upcoming', config),
                axios.get('/api/academic/attendance/my', config),
                axios.get('/api/finance/my-fees', config)
            ]);
            
            setAssignments(assignRes.data);
            setLectures(lectureRes.data);
            
            // Calculate overall attendance percentage
            if (attendanceRes.data && attendanceRes.data.stats) {
                const stats = Object.values(attendanceRes.data.stats);
                if (stats.length > 0) {
                    const avg = stats.reduce((acc, s) => acc + s.percentage, 0) / stats.length;
                    setAttendanceStats({
                        percentage: `${Math.round(avg)}%`,
                        status: avg > 75 ? 'Good' : 'Low'
                    });
                }
            }

            // Check Fee Status
            const isPaid = feeRes.data.some(f => f.status === 'Paid');
            setFeeStatus(isPaid ? 'Paid' : 'Pending');

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data', error);
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Courses Enrolled', value: user?.courses?.length?.toString() || '0', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Current GPA', value: '0.00', icon: Award, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { label: 'Attendance', value: attendanceStats.percentage, icon: Calendar, color: 'text-accent', bg: 'bg-accent/10' },
        { label: 'Fees Status', value: feeStatus, icon: CreditCard, color: feeStatus === 'Paid' ? 'text-teal-500' : 'text-rose-500', bg: feeStatus === 'Paid' ? 'bg-teal-500/10' : 'bg-rose-500/10' },
    ];

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-4xl font-black text-text tracking-tight">Student Portal</h2>
                <p className="text-text/40 mt-2 font-medium uppercase tracking-widest text-xs">Welcome Back • {user?.name}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card group hover:border-accent/30 transition-all"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-lg`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-sm text-text/40 font-medium">{stat.label}</p>
                        <h4 className="text-3xl font-bold text-text mt-1">{stat.value}</h4>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text">
                            <Clock className="w-5 h-5 text-accent" /> Recent Assignments
                        </h3>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-text/40 italic py-4">Checking for tasks...</div>
                            ) : assignments.length === 0 ? (
                                <div className="text-text/40 italic py-4 text-center">No pending assignments! Good job.</div>
                            ) : (
                                assignments.slice(0, 3).map((task, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 bg-card rounded-2xl border border-border hover:bg-card transition-all">
                                        <div>
                                            <h4 className="font-bold text-text text-sm">{task.title}</h4>
                                            <span className="text-xs text-text/40">{task.course?.courseName}</span>
                                        </div>
                                        <span className="text-rose-400 font-bold text-[10px] uppercase tracking-tighter">
                                            {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text">
                            <Calendar className="w-5 h-5 text-teal-500" /> Upcoming Lectures
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {loading ? (
                                <div className="col-span-2 text-text/40 italic py-4">Fetching schedule...</div>
                            ) : lectures.length === 0 ? (
                                <div className="col-span-2 text-text/40 italic py-4 text-center">No classes scheduled yet.</div>
                            ) : (
                                lectures.map((lecture, i) => (
                                    <div key={i} className="p-4 bg-card rounded-2xl border border-border hover:border-teal-500/30 transition-all">
                                        <h4 className="font-bold text-text text-sm mb-1">{lecture.courseName}</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] text-text/40 font-bold uppercase">
                                                <UserIcon className="w-3 h-3 text-teal-500" /> {lecture.teacher}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-text/40 font-bold uppercase">
                                                <Clock className="w-3 h-3 text-teal-500" /> {lecture.schedule}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-text/40 font-bold uppercase">
                                                <MapPin className="w-3 h-3 text-teal-500" /> {lecture.location}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="glass-card h-fit">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text">
                        <Bell className="w-5 h-5 text-accent" /> Announcements
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10">
                            <p className="text-xs text-text/80 leading-relaxed">Semester final exams will begin from June 15th. Check the full schedule in the downloads section.</p>
                            <span className="text-[10px] text-accent font-bold block mt-2">ADMIN • 2h ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;


