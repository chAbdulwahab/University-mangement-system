import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, Search, Save, CheckCircle, User, ChevronLeft, Star } from 'lucide-react';
import { useSelector } from 'react-redux';

const MarksManagement = () => {
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [marksData, setMarksData] = useState({}); // { studentId: marks }
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
            
            // Fetch existing results for this course to populate input fields
            // (Optional: Implement getResultsByCourse endpoint if needed)
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students');
            setLoading(false);
        }
    };

    const submitMarks = async (studentId) => {
        const marks = marksData[studentId];
        if (!marks) return alert('Please enter marks');

        setSubmitting(true);
        try {
            await axios.post('/api/academic/results', {
                studentId,
                courseId: selectedCourse._id,
                marks,
                semester: selectedCourse.semester
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Marks saved successfully!');
            setSubmitting(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving marks');
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-4xl font-black text-text tracking-tight">Academic Records</h2>
                <p className="text-text/40 mt-1 uppercase tracking-widest text-[10px] font-bold">Faculty Portal • Grading System</p>
            </header>

            {!selectedCourse ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center italic text-text/20">Loading courses...</div>
                    ) : courses.length === 0 ? (
                        <div className="col-span-full glass-card py-20 text-center text-text/40">
                            <Award className="w-12 h-12 mx-auto mb-4 opacity-10" />
                            <p>No courses assigned for grading.</p>
                        </div>
                    ) : (
                        courses.map(course => (
                            <motion.div 
                                key={course._id} 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => handleCourseSelect(course)}
                                className="glass-card cursor-pointer border-border hover:border-accent transition-all group shadow-xl shadow-lg"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-text transition-all shadow-lg shadow-accent/5">
                                        <Award className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-text group-hover:text-accent transition-colors">{course.courseName}</h4>
                                        <span className="text-[10px] font-black text-text/40 uppercase tracking-tighter bg-card px-2 py-0.5 rounded">
                                            {course.courseCode}
                                        </span>
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <button 
                            onClick={() => setSelectedCourse(null)}
                            className="flex items-center gap-2 text-text/40 hover:text-text transition-colors text-sm font-bold uppercase tracking-wider"
                        >
                            <ChevronLeft className="w-5 h-5" /> Back to List
                        </button>
                        
                        <div className="flex items-center gap-4 bg-card px-6 py-3 rounded-2xl border border-border">
                            <div className="flex items-center gap-2 text-accent border-r border-border pr-4">
                                <Star className="w-5 h-5" />
                                <span className="text-sm font-black">Semester {selectedCourse.semester}</span>
                            </div>
                            <div className="flex items-center gap-2 text-text">
                                <Award className="w-5 h-5 text-teal-400" />
                                <span className="text-sm font-bold">{selectedCourse.courseName}</span>
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
                                        <th className="px-8 py-5 font-bold text-text/60 uppercase text-[10px] tracking-[0.2em] text-center">Marks (Max 100)</th>
                                        <th className="px-8 py-5 font-bold text-text/60 uppercase text-[10px] tracking-[0.2em] text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {loading ? (
                                        <tr><td colSpan="4" className="px-8 py-20 text-center text-text/20 italic">Loading student roster...</td></tr>
                                    ) : students.length === 0 ? (
                                        <tr><td colSpan="4" className="px-8 py-20 text-center text-text/20 italic">No students enrolled in this course.</td></tr>
                                    ) : (
                                        students.map(student => (
                                            <tr key={student._id} className="hover:bg-card transition-colors">
                                                <td className="px-8 py-5 font-bold text-text">{student.name}</td>
                                                <td className="px-8 py-5">
                                                    <span className="font-mono text-sm text-accent bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">
                                                        {student.rollNumber}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <input 
                                                        type="number" 
                                                        className="bg-card border border-border rounded-xl px-4 py-2 w-28 text-center text-text font-bold focus:border-accent outline-none transition-all shadow-inner"
                                                        placeholder="0.0"
                                                        value={marksData[student._id] || ''}
                                                        onChange={(e) => setMarksData({...marksData, [student._id]: e.target.value})}
                                                    />
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button 
                                                        onClick={() => submitMarks(student._id)}
                                                        className="inline-flex items-center gap-2 bg-teal-500/10 hover:bg-teal-500 text-teal-400 hover:text-text px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-teal-500/20"
                                                    >
                                                        <Save className="w-4 h-4" /> Save Result
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default MarksManagement;


