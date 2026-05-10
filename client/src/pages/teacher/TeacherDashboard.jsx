import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, BookOpen, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';

const TeacherDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [myCourses, setMyCourses] = useState([]);
    const [statsData, setStatsData] = useState({ avgAttendance: '0%', pendingAssignments: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [coursesRes, statsRes] = await Promise.all([
                axios.get('/api/courses/my-courses', config),
                axios.get('/api/academic/teacher/stats', config)
            ]);
            
            setMyCourses(coursesRes.data);
            setStatsData(statsRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teacher dashboard data', error);
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Assigned Courses', value: myCourses.length.toString(), icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Students', value: myCourses.reduce((acc, curr) => acc + (curr.students?.length || 0), 0).toString(), icon: Users, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { label: 'Avg. Attendance', value: statsData.avgAttendance, icon: CheckCircle, color: 'text-accent', bg: 'bg-accent/10' },
        { label: 'Assignments Pending', value: statsData.pendingAssignments.toString(), icon: Clock, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    ];

    return (
        <div className="space-y-10">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card group hover:border-border transition-all shadow-xl shadow-lg"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform shadow-lg shadow-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-black text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full uppercase tracking-widest border border-teal-500/20">Active</span>
                        </div>
                        <p className="text-sm text-text/40 font-medium">{stat.label}</p>
                        <h4 className="text-3xl font-bold text-text mt-1">{stat.value}</h4>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text">
                        <Calendar className="w-5 h-5 text-accent" /> Upcoming Classes
                    </h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-text/40 italic py-4">Loading schedule...</div>
                        ) : myCourses.length === 0 ? (
                            <div className="text-text/40 italic py-4 text-center">No classes assigned yet.</div>
                        ) : (
                            myCourses.map((cls, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-card/40 rounded-2xl border border-border hover:bg-card transition-all">
                                    <div>
                                        <h4 className="font-bold text-text text-sm">{cls.courseName}</h4>
                                        <span className="text-[10px] text-text/40 uppercase font-black">{cls.location || 'Room TBD'} • {cls.courseCode}</span>
                                    </div>
                                    <span className="text-accent font-black text-xs bg-accent/10 px-3 py-1 rounded-full border border-accent/20">{cls.schedule || 'TBD'}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6 text-text">Faculty Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-6 bg-card/40 rounded-2xl border border-border hover:border-accent/50 transition-all text-center group"
                        >
                            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-text/20 group-hover:text-accent" />
                            <span className="text-sm font-bold text-text/80">Mark Attendance</span>
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-6 bg-card/40 rounded-2xl border border-border hover:border-accent/50 transition-all text-center group"
                        >
                            <BookOpen className="w-8 h-8 mx-auto mb-3 text-text/20 group-hover:text-accent" />
                            <span className="text-sm font-bold text-text/80">Upload Results</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;


