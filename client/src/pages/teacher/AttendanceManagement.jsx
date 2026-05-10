import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Calendar, BookOpen, Users, ChevronLeft, Save } from 'lucide-react';
import { useSelector } from 'react-redux';

const AttendancePortal = () => {
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'Present' }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchTeacherCourses();
    }, []);

    const fetchTeacherCourses = async () => {
        try {
            const { data } = await axios.get('/api/courses/my-courses', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setCourses(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses');
            setLoading(false);
        }
    };

    const handleCourseSelect = async (course) => {
        setSelectedCourse(course);
        setLoading(true);
        try {
            const { data } = await axios.get(`/api/courses/${course._id}/students`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setStudents(data);
            
            // Initialize attendance as all Present
            const initialAttendance = {};
            data.forEach(s => initialAttendance[s._id] = 'Present');
            setAttendance(initialAttendance);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students');
            setLoading(false);
        }
    };

    const submitAttendance = async () => {
        setSubmitting(true);
        const attendanceData = Object.keys(attendance).map(studentId => ({
            studentId,
            status: attendance[studentId]
        }));

        try {
            await axios.post('/api/academic/attendance', {
                courseId: selectedCourse._id,
                attendanceData
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Attendance submitted successfully!');
            setSelectedCourse(null);
        } catch (error) {
            alert('Error submitting attendance');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">

            {!selectedCourse ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center italic text-text/20">Loading assigned courses...</div>
                    ) : courses.length === 0 ? (
                        <div className="col-span-full glass-card py-20 text-center text-text/40">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No courses assigned to you for this semester.</p>
                        </div>
                    ) : (
                        courses.map(course => (
                            <motion.div 
                                key={course._id} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => handleCourseSelect(course)}
                                className="glass-card cursor-pointer border-border hover:border-accent group transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-text transition-all shadow-lg shadow-accent/5">
                                        <BookOpen className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text group-hover:text-accent transition-colors">{course.courseName}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-black text-text/40 uppercase tracking-tighter bg-card px-2 py-0.5 rounded">
                                                {course.courseCode}
                                            </span>
                                            <span className="text-[10px] font-black text-accent uppercase tracking-tighter">
                                                {course.semester}th Semester
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <button 
                            onClick={() => setSelectedCourse(null)}
                            className="flex items-center gap-2 text-text/40 hover:text-text transition-colors text-sm font-bold uppercase tracking-wider"
                        >
                            <ChevronLeft className="w-5 h-5" /> Back to Courses
                        </button>
                        
                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4 bg-card px-4 md:px-6 py-3 rounded-2xl border border-border">
                            <div className="flex items-center gap-2 text-accent xs:border-r border-border xs:pr-4">
                                <Calendar className="w-5 h-5" />
                                <span className="text-sm font-black">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text">
                                <Users className="w-5 h-5 text-teal-400" />
                                <span className="text-sm font-bold truncate max-w-[150px] md:max-w-none">{selectedCourse.courseName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden !p-0 border-border shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-card border-b border-border">
                                    <tr>
                                        <th className="px-8 py-5 font-bold text-text/60 uppercase text-[10px] tracking-[0.2em]">Student Details</th>
                                        <th className="px-8 py-5 font-bold text-text/60 uppercase text-[10px] tracking-[0.2em]">Roll Number</th>
                                        <th className="px-8 py-5 font-bold text-text/60 uppercase text-[10px] tracking-[0.2em] text-center">Attendance Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr><td colSpan="3" className="px-8 py-20 text-center text-text/20 italic">Fetching student roster...</td></tr>
                                    ) : students.length === 0 ? (
                                        <tr><td colSpan="3" className="px-8 py-20 text-center text-text/20 italic">No students enrolled in this course yet.</td></tr>
                                    ) : (
                                        students.map(student => (
                                            <tr key={student._id} className="hover:bg-card transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="font-bold text-text">{student.name}</div>
                                                    <div className="text-xs text-text/40">{student.email}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="font-mono text-sm text-accent bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">
                                                        {student.rollNumber}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                                                        {['Present', 'Absent', 'Late'].map(status => (
                                                            <button
                                                                key={status}
                                                                onClick={() => setAttendance({...attendance, [student._id]: status})}
                                                                className={`px-3 md:px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border shrink-0 ${
                                                                    attendance[student._id] === status 
                                                                    ? (status === 'Present' ? 'bg-teal-500 text-text border-teal-500 shadow-lg shadow-teal-500/20' : status === 'Absent' ? 'bg-rose-500 text-text border-rose-500 shadow-lg shadow-rose-500/20' : 'bg-amber-500 text-text border-amber-500 shadow-lg shadow-amber-500/20')
                                                                    : 'bg-card text-text/40 border-border hover:border-border'
                                                                }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={submitAttendance}
                            disabled={submitting || students.length === 0}
                            className="btn-primary px-10 py-4 font-black text-lg flex items-center gap-3 shadow-2xl shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Processing...' : (
                                <>
                                    <Save className="w-6 h-6" />
                                    Submit Attendance
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default AttendancePortal;


