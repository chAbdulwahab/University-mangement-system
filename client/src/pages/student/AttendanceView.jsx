import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AttendanceView = () => {
    const { user } = useSelector((state) => state.auth);
    const [attendanceData, setAttendanceData] = useState({ history: [], stats: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const { data } = await axios.get('/api/academic/attendance/my', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAttendanceData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching attendance', error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-3xl font-bold text-text">Attendance Tracking</h2>
                <p className="text-text/40">Monitor your presence and academic consistency.</p>
            </header>

            {loading ? (
                <div className="py-20 text-center text-text/20 italic">Loading your records...</div>
            ) : attendanceData.stats.length === 0 ? (
                <div className="glass-card py-20 text-center text-text/40">
                    No attendance records found yet. Keep attending classes!
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {attendanceData.stats.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="glass-card"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-sm text-text/80">{item.subject}</h4>
                                    <span className={`text-xs font-black ${item.percentage >= 75 ? 'text-teal-400' : 'text-rose-400'}`}>
                                        {item.percentage}%
                                    </span>
                                </div>
                                
                                <div className="w-full h-2 bg-card rounded-full overflow-hidden mb-6">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.percentage}%` }}
                                        transition={{ duration: 1, delay: idx * 0.2 }}
                                        className={`h-full ${item.percentage >= 75 ? 'bg-teal-500' : 'bg-rose-500'}`}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-card p-3 rounded-xl text-center">
                                        <span className="block text-[10px] text-text/20 uppercase font-black mb-1">Present</span>
                                        <span className="text-lg font-bold text-teal-400">{item.present}</span>
                                    </div>
                                    <div className="bg-card p-3 rounded-xl text-center">
                                        <span className="block text-[10px] text-text/20 uppercase font-black mb-1">Absent</span>
                                        <span className="text-lg font-bold text-rose-400">{item.absent}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="glass-card">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-text">
                            <Calendar className="w-5 h-5 text-accent" /> Attendance History
                        </h3>
                        <div className="space-y-4">
                            {attendanceData.history.map((record, i) => (
                                <div key={i} className="p-4 bg-card rounded-2xl border border-border flex justify-between items-center hover:bg-card transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${record.status === 'Present' ? 'bg-teal-500' : 'bg-rose-500'}`}></div>
                                        <span className="text-sm font-medium text-text/80">{record.course?.courseName}</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-[10px] text-text/40 uppercase font-bold flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {new Date(record.date).toLocaleDateString()}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                            record.status === 'Present' 
                                            ? 'text-teal-400 bg-teal-500/10' 
                                            : 'text-rose-400 bg-rose-500/10'
                                        }`}>
                                            {record.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AttendanceView;


