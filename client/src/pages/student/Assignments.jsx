import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, Clock, CheckCircle, AlertCircle, X, Send, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const Assignments = () => {
    const { user } = useSelector((state) => state.auth);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            const { data } = await axios.get('/api/academic/assignments', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setAssignments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching assignments', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`/api/academic/assignments/${selectedTask._id}/submit`, {
                fileUrl: submissionUrl
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Assignment submitted successfully!');
            setSelectedTask(null);
            setSubmissionUrl('');
            fetchAssignments();
        } catch (error) {
            alert(error.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-4xl font-black text-text tracking-tight">Academic Tasks</h2>
                <p className="text-text/40 mt-1 uppercase tracking-widest text-[10px] font-bold">Student Terminal • Submission Portal</p>
            </header>

            {loading ? (
                <div className="py-20 text-center text-text/20 italic">Loading tasks...</div>
            ) : assignments.length === 0 ? (
                <div className="glass-card py-20 text-center text-text/40 border-dashed border-2">
                    <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-teal-500" />
                    </div>
                    <p className="text-xl font-bold text-text">All caught up!</p>
                    <p className="mt-2">No pending assignments for your courses.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {assignments.map((task, i) => {
                        const isSubmitted = task.submissions?.some(s => s.student === user._id);
                        return (
                            <motion.div 
                                key={task._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card flex flex-col justify-between group hover:border-accent/30 transition-all shadow-xl shadow-lg"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center text-text/20 group-hover:bg-accent/10 group-hover:text-accent transition-all shadow-lg">
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                            isSubmitted ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {isSubmitted ? 'Submitted' : 'Pending'}
                                        </span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-text mb-1 group-hover:text-accent transition-colors">{task.title}</h4>
                                    <div className="flex items-center gap-2 mb-6">
                                        <span className="text-[10px] font-black text-text/40 uppercase tracking-tighter bg-card px-2 py-0.5 rounded">
                                            {task.course?.courseCode}
                                        </span>
                                        <span className="text-[10px] font-black text-accent uppercase tracking-tighter">
                                            {task.course?.courseName}
                                        </span>
                                    </div>
                                    {task.description && (
                                        <p className="text-xs text-text/30 leading-relaxed line-clamp-3 mb-6 bg-card p-4 rounded-xl italic">
                                            "{task.description}"
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-border">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-text/20">
                                        <Clock className="w-4 h-4 text-accent" />
                                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedTask(task)}
                                        disabled={isSubmitted}
                                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isSubmitted 
                                            ? 'bg-card text-text/20 border border-border cursor-default' 
                                            : 'bg-accent text-text hover:bg-accent/80 shadow-lg shadow-accent/20'
                                        }`}
                                    >
                                        {isSubmitted ? 'View Work' : 'Submit Now'}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Submission Modal */}
            <AnimatePresence>
                {selectedTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-md relative shadow-2xl border-border"
                        >
                            <button 
                                onClick={() => setSelectedTask(null)}
                                className="absolute top-4 right-4 text-text/40 hover:text-text transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center text-accent">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-text">Submit Work</h3>
                                    <p className="text-[10px] font-black text-text/40 uppercase tracking-widest">{selectedTask.title}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <LinkIcon className="w-3 h-3 text-accent" /> Submission Link (Drive/Github)
                                    </label>
                                    <input 
                                        type="url" 
                                        required
                                        placeholder="https://google.drive/your-file"
                                        className="input-field w-full"
                                        value={submissionUrl}
                                        onChange={(e) => setSubmissionUrl(e.target.value)}
                                    />
                                    <p className="text-[10px] text-text/20 italic">Provide a shareable link to your document or repository.</p>
                                </div>

                                <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-teal-400 shrink-0" />
                                    <p className="text-[10px] font-medium text-teal-400 leading-relaxed">
                                        Once submitted, your work will be timestamped and sent to Prof. {selectedTask.teacher?.name || 'Instructor'} for grading.
                                    </p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="btn-primary w-full py-4 font-black text-lg shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Processing...' : (
                                        <>
                                            <Send className="w-5 h-5" /> Confirm Submission
                                        </>
                                    )}
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


