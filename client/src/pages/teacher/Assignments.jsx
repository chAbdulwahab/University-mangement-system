import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Calendar, Users, Send, X, BookOpen, AlertCircle, ExternalLink, Download, Clock, CheckCircle2, Save, Star } from 'lucide-react';
import { useSelector } from 'react-redux';

const Assignments = () => {
    const { user } = useSelector((state) => state.auth);
    const [assignments, setAssignments] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSubmissions, setShowSubmissions] = useState(null); // Assignment object
    const [gradingMarks, setGradingMarks] = useState({}); // { studentId: marks }
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        dueDate: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [assignRes, coursesRes] = await Promise.all([
                axios.get('/api/academic/assignments/teacher', config),
                axios.get('/api/courses/my-courses', config)
            ]);
            setAssignments(assignRes.data);
            setMyCourses(coursesRes.data);
            
            // Initialize grading marks from existing submissions
            const marks = {};
            assignRes.data.forEach(a => {
                a.submissions.forEach(s => {
                    marks[`${a._id}_${s.student?._id}`] = s.marks || 0;
                });
            });
            setGradingMarks(marks);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/academic/assignments', formData, config);
            alert('Assignment created successfully!');
            setShowModal(false);
            setFormData({ title: '', description: '', courseId: '', dueDate: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create assignment');
        }
    };

    const handleGrade = async (assignmentId, studentId) => {
        const marks = gradingMarks[`${assignmentId}_${studentId}`];
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`/api/academic/assignments/${assignmentId}/grade/${studentId}`, { marks }, config);
            
            // Update local state for visual feedback
            const updatedAssignments = assignments.map(a => {
                if (a._id === assignmentId) {
                    const updatedSubs = a.submissions.map(s => {
                        if (s.student?._id === studentId) {
                            return { ...s, marks: Number(marks), isChecked: true };
                        }
                        return s;
                    });
                    return { ...a, submissions: updatedSubs };
                }
                return a;
            });
            setAssignments(updatedAssignments);
            
            // If modal is open, update reference
            if (showSubmissions && showSubmissions._id === assignmentId) {
                setShowSubmissions(updatedAssignments.find(a => a._id === assignmentId));
            }

            alert('Marks saved and GPA synchronized!');
        } catch (error) {
            alert('Failed to save grade');
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-text tracking-tight uppercase">Faculty Terminal</h2>
                    <p className="text-text/40 mt-1 uppercase tracking-widest text-[10px] font-bold">Assignment & Grading Engine</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-3 font-bold shadow-xl shadow-accent/20"
                >
                    <Plus className="w-5 h-5" /> New Assignment
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center italic text-text/20">Loading academic tasks...</div>
                ) : assignments.length === 0 ? (
                    <div className="col-span-full glass-card py-20 text-center text-text/40 border-dashed border-2">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        <p>No assignments created yet. Start by creating one for your courses.</p>
                    </div>
                ) : (
                    assignments.map((assignment, idx) => (
                        <motion.div 
                            key={assignment._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card group hover:border-accent/30 transition-all shadow-xl shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-text transition-all shadow-lg shadow-accent/5">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                    new Date(assignment.dueDate) > new Date() 
                                    ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' 
                                    : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                }`}>
                                    {new Date(assignment.dueDate) > new Date() ? 'Open' : 'Expired'}
                                </span>
                            </div>
                            
                            <h3 className="text-xl font-bold text-text mb-1 group-hover:text-accent transition-colors">{assignment.title}</h3>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-[10px] font-black text-text/40 uppercase tracking-tighter bg-card px-2 py-0.5 rounded">
                                    {assignment.course?.courseCode}
                                </span>
                                <span className="text-[10px] font-black text-accent uppercase tracking-tighter">
                                    {assignment.course?.courseName}
                                </span>
                            </div>

                            <div className="flex items-center gap-6 pt-6 border-t border-border">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-text/40">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-text/40">
                                    <Users className="w-4 h-4 text-teal-400" />
                                    <span>Submissions: {assignment.submissions?.length || 0}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button 
                                    onClick={() => setShowSubmissions(assignment)}
                                    className="flex-1 py-3 bg-card hover:bg-card rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-border flex items-center justify-center gap-2"
                                >
                                    <Star className="w-4 h-4 text-accent" /> Grade Submissions
                                </button>
                                <button className="flex-1 py-3 bg-accent/10 hover:bg-accent text-accent hover:text-text rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-accent/20">
                                    Edit Details
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* View & Grade Submissions Modal */}
            <AnimatePresence>
                {showSubmissions && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-3xl relative shadow-2xl border-border !p-0 overflow-hidden"
                        >
                            <div className="p-8 border-b border-border flex justify-between items-center bg-card">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                                        <Star className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-text">Grading Terminal</h3>
                                        <p className="text-[10px] font-black text-text/40 uppercase tracking-widest">{showSubmissions.title}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowSubmissions(null)}
                                    className="text-text/40 hover:text-text transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-card border-b border-border">
                                        <tr>
                                            <th className="px-8 py-4 font-black text-text/60 uppercase text-[10px] tracking-widest">Student</th>
                                            <th className="px-8 py-4 font-black text-text/60 uppercase text-[10px] tracking-widest text-center">Marks</th>
                                            <th className="px-8 py-4 text-center font-black text-text/60 uppercase text-[10px] tracking-widest">Status</th>
                                            <th className="px-8 py-4 text-right font-black text-text/60 uppercase text-[10px] tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {showSubmissions.submissions?.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="px-8 py-20 text-center text-text/20 italic">No submissions yet for this task.</td>
                                            </tr>
                                        ) : (
                                            showSubmissions.submissions.map((sub, i) => (
                                                <tr key={i} className="hover:bg-card transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="font-bold text-text">{sub.student?.name}</div>
                                                        <div className="text-[10px] font-black text-accent uppercase">{sub.student?.rollNumber}</div>
                                                    </td>
                                                    <td className="px-8 py-5 text-center">
                                                        <input 
                                                            type="number" 
                                                            className="bg-card border border-border rounded-xl px-3 py-1.5 w-20 text-center text-text font-bold focus:border-accent outline-none"
                                                            value={gradingMarks[`${showSubmissions._id}_${sub.student?._id}`] || 0}
                                                            onChange={(e) => setGradingMarks({...gradingMarks, [`${showSubmissions._id}_${sub.student?._id}`]: e.target.value})}
                                                        />
                                                    </td>
                                                    <td className="px-8 py-5 text-center">
                                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                                                            sub.isChecked ? 'bg-teal-500/10 text-teal-400' : 'bg-amber-500/10 text-amber-400'
                                                        }`}>
                                                            {sub.isChecked ? 'Graded' : 'Pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <a 
                                                                href={sub.fileUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-card hover:bg-card rounded-lg text-text/40 hover:text-text transition-all"
                                                                title="Open Submission Link"
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </a>
                                                            <button 
                                                                onClick={() => handleGrade(showSubmissions._id, sub.student?._id)}
                                                                className="inline-flex items-center gap-2 bg-accent/10 hover:bg-accent text-accent hover:text-text px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                                            >
                                                                <Save className="w-3 h-3" /> Save Grade
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Assignment Modal */}
            {/* (Same as before) */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-lg relative shadow-2xl border-border"
                        >
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-text/40 hover:text-text transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                                    <Plus className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-text">Create Assignment</h3>
                                    <p className="text-[10px] font-black text-text/40 uppercase tracking-widest">New Academic Task</p>
                                </div>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em]">Select Course</label>
                                    <select 
                                        required
                                        className="input-field w-full bg-background"
                                        value={formData.courseId}
                                        onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                                    >
                                        <option value="">Choose a course...</option>
                                        {myCourses.map(c => (
                                            <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em]">Assignment Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Midterm Lab Project"
                                        className="input-field w-full"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em]">Due Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="input-field w-full"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em]">Description / Instructions</label>
                                    <textarea 
                                        rows="4"
                                        placeholder="Outline the task requirements..."
                                        className="input-field w-full resize-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn-primary w-full py-4 font-black text-lg shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" /> Launch Assignment
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Assignments;


