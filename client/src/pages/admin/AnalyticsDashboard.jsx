import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';

const Analytics = () => {
    const { user } = useSelector((state) => state.auth);
    const { theme } = useTheme();
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    const iconMap = {
        DollarSign: DollarSign,
        TrendingUp: TrendingUp,
        Users: Users,
        BookOpen: BookOpen
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await axios.get('/api/admin/analytics', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setAnalyticsData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching analytics', error);
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [user.token]);

    if (loading) {
        return (
            <div className="h-96 w-full flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const { monthlyData, deptPerformance, stats } = analyticsData;

    return (
        <div className="space-y-8 pb-12">

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="glass-card"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-card flex items-center justify-center ${stat.color}`}>
                                {(() => {
                                    const Icon = iconMap[stat.icon] || TrendingUp;
                                    return <Icon className="w-5 h-5" />;
                                })()}
                            </div>
                            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded-full">
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-sm text-text/40 font-medium">{stat.label}</p>
                        <h4 className="text-2xl font-bold text-text mt-1">{stat.value}</h4>
                    </motion.div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Chart */}
                <div className="glass-card h-[400px] flex flex-col">
                    <h3 className="text-xl font-bold mb-6">Revenue Growth (Monthly)</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={monthlyData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                                <YAxis stroke="#ffffff40" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', 
                                        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
                                        borderRadius: '12px'
                                    }}
                                    itemStyle={{ color: theme === 'dark' ? '#f8fafc' : '#1e293b' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#2563EB" fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Enrollment Chart */}
                <div className="glass-card h-[400px] flex flex-col">
                    <h3 className="text-xl font-bold mb-6">Student Enrollment Trends</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                                <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} />
                                <YAxis stroke="#ffffff40" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff', 
                                        border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`, 
                                        borderRadius: '12px'
                                    }}
                                    itemStyle={{ color: theme === 'dark' ? '#f8fafc' : '#1e293b' }}
                                />
                                <Bar dataKey="students" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Department Performance List */}
            <div className="glass-card">
                <h3 className="text-xl font-bold mb-6">Department Efficiency Ranking</h3>
                <div className="space-y-6">
                    {deptPerformance.map((dept, i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{dept.name}</span>
                                <span className="text-text/40">{dept.score}%</span>
                            </div>
                            <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${dept.score}%` }}
                                    transition={{ duration: 1, delay: i * 0.2 }}
                                    className={`h-full ${dept.color}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics;


