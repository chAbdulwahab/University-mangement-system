import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserCheck, BookOpen, CreditCard, Landmark, TrendingUp } from 'lucide-react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [counts, setCounts] = useState({
        students: 0,
        teachers: 0,
        courses: 0,
        departments: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                const { data } = await axios.get('/api/admin/stats', config);
                setCounts(data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, [user.token]);

    const stats = [
        { label: 'Total Students', value: counts.students.toLocaleString(), icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Active Faculty', value: counts.teachers.toLocaleString(), icon: UserCheck, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { label: 'Total Courses', value: counts.courses.toLocaleString(), icon: BookOpen, color: 'text-accent', bg: 'bg-accent/10' },
        { label: 'Departments', value: counts.departments.toLocaleString(), icon: Landmark, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    ];

    return (
        <div className="space-y-10">
            <header>
                <h2 className="text-4xl font-black text-text tracking-tight">Admin Terminal</h2>
                <p className="text-text/40 mt-2 font-medium uppercase tracking-widest text-xs">University Management System • {user?.name}</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card group hover:border-border transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full">+4.5%</span>
                        </div>
                        <p className="text-sm text-text/40 font-medium">{stat.label}</p>
                        <h4 className="text-3xl font-bold text-text mt-1">{stat.value}</h4>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card min-h-[400px] flex flex-col justify-center items-center text-center">
                    <TrendingUp className="w-16 h-16 text-text/10 mb-4" />
                    <h3 className="text-xl font-bold text-text/60">Operational Insights</h3>
                    <p className="text-text/30 max-w-sm mt-2 italic">Select "Analytics" from the sidebar for detailed performance charts and revenue mapping.</p>
                </div>
                
                <div className="glass-card">
                    <h3 className="text-xl font-bold mb-6">System Health</h3>
                    <div className="space-y-6">
                        {[
                            { name: 'Database Connectivity', status: 'Optimal', color: 'text-teal-400' },
                            { name: 'Storage Capacity', status: '85% Free', color: 'text-teal-400' },
                            { name: 'API Response Time', status: '12ms', color: 'text-teal-400' },
                        ].map((sys, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-card rounded-2xl border border-border">
                                <span className="text-sm font-medium text-text/60">{sys.name}</span>
                                <span className={`text-xs font-bold ${sys.color}`}>{sys.status}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;


