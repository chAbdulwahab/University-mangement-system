import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookPlus, CheckCircle, Search, Book, CreditCard, ShieldCheck } from 'lucide-react';

const EnrollCourses = () => {
    const [courses, setCourses] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [studentSemester, setStudentSemester] = useState(1);
    const [isFeePaid, setIsFeePaid] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData.token;
            
            const [resCourses, resUser, resFees] = await Promise.all([
                axios.get('/api/courses', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('/api/finance/my-fees', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setCourses(resCourses.data);
            setUserCourses(resUser.data.courses || []);
            setStudentSemester(resUser.data.semester || 1);
            
            // Check if any fee record is marked as 'Paid'
            const paid = resFees.data.some(f => f.status === 'Paid');
            setIsFeePaid(paid);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            const userData = JSON.parse(localStorage.getItem('user'));
            const token = userData.token;
            await axios.post('/api/courses/enroll', {
                studentId: userData._id,
                courseId: courseId,
                semester: userData.semester || 1
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUserCourses([...userCourses, courseId]);
            alert('Successfully enrolled!');
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Enrollment failed');
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-text">Course Enrollment</h2>
                    <p className="text-text/40">Browse available subjects for Semester {studentSemester}.</p>
                </div>
                {isFeePaid && (
                    <div className="flex items-center gap-2 bg-teal-500/10 text-teal-400 px-4 py-2 rounded-xl border border-teal-500/20 shadow-lg shadow-teal-500/5">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-wider">Fee Verified</span>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center italic text-text/20">Loading catalog...</div>
                ) : (
                    courses.filter(c => c.semester === studentSemester).map(course => {
                        const isEnrolled = userCourses.includes(course._id);
                        return (
                            <motion.div 
                                key={course._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`glass-card relative overflow-hidden group ${isEnrolled ? 'border-teal-500/30' : ''}`}
                            >
                                {isEnrolled && (
                                    <div className={`absolute top-0 right-0 p-2 text-text rounded-bl-xl shadow-lg transition-colors ${isFeePaid ? 'bg-teal-500' : 'bg-amber-500'}`}>
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                )}
                                
                                <div className="w-12 h-12 bg-card rounded-xl flex items-center justify-center mb-4 text-text/40 group-hover:text-accent transition-colors">
                                    <Book className="w-6 h-6" />
                                </div>
                                
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="text-lg font-bold text-text">{course.courseName}</h4>
                                        <p className="text-sm text-accent font-mono">{course.courseCode}</p>
                                    </div>
                                    {isEnrolled && isFeePaid && (
                                        <div title="Course Fee Paid" className="text-teal-400">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex justify-between items-center pt-4 border-t border-border">
                                    <span className="text-xs text-text/40">{course.creditHours} Credits</span>
                                    <button 
                                        disabled={isEnrolled}
                                        onClick={() => handleEnroll(course._id)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            isEnrolled 
                                            ? 'bg-card text-text/20 cursor-not-allowed' 
                                            : 'bg-accent hover:bg-accent/80 text-text shadow-lg shadow-accent/20'
                                        }`}
                                    >
                                        {isEnrolled ? 'Enrolled' : 'Enroll Now'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default EnrollCourses;


