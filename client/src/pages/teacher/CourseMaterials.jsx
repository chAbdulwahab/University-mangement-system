import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, Folder, MoreVertical, ExternalLink, X, Send, BookOpen, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const CourseMaterials = () => {
    const { user } = useSelector((state) => state.auth);
    const [materials, setMaterials] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null); // Course object
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        courseId: '',
        fileUrl: '',
        fileType: 'PDF',
        fileSize: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [materialsRes, coursesRes] = await Promise.all([
                axios.get('/api/academic/materials/teacher', config),
                axios.get('/api/courses/my-courses', config)
            ]);
            setMaterials(materialsRes.data);
            setMyCourses(coursesRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data', error);
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            // Simulate file size if not provided
            const finalData = {
                ...formData,
                fileSize: formData.fileSize || `${(Math.random() * 5 + 1).toFixed(1)} MB`
            };
            await axios.post('/api/academic/materials', finalData, config);
            alert('Material uploaded successfully!');
            setShowModal(false);
            setFormData({ title: '', description: '', courseId: '', fileUrl: '', fileType: 'PDF', fileSize: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to upload material');
        }
    };

    const filteredMaterials = selectedCourse 
        ? materials.filter(m => m.course?._id === selectedCourse._id)
        : materials;

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <button 
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-3 font-bold shadow-xl shadow-accent/20 w-full sm:w-auto justify-center"
                >
                    <Upload className="w-5 h-5" /> Upload Resource
                </button>
            </div>

            {/* Course Folders */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div 
                    onClick={() => setSelectedCourse(null)}
                    className={`glass-card flex flex-col items-center justify-center py-8 border-2 transition-all cursor-pointer group ${!selectedCourse ? 'border-accent bg-accent/5' : 'border-border hover:border-border'}`}
                >
                    <Folder className={`w-12 h-12 mb-4 group-hover:scale-110 transition-transform ${!selectedCourse ? 'text-accent' : 'text-text/20'}`} />
                    <span className="font-bold text-text">All Materials</span>
                    <span className="text-[10px] text-text/40 uppercase font-black">{materials.length} Files</span>
                </motion.div>

                {myCourses.map((course) => (
                    <motion.div 
                        key={course._id}
                        onClick={() => setSelectedCourse(course)}
                        className={`glass-card flex flex-col items-center justify-center py-8 border-2 transition-all cursor-pointer group ${selectedCourse?._id === course._id ? 'border-accent bg-accent/5' : 'border-border hover:border-border'}`}
                    >
                        <Folder className={`w-12 h-12 mb-4 group-hover:scale-110 transition-transform ${selectedCourse?._id === course._id ? 'text-accent' : 'text-text/20'}`} />
                        <span className="font-bold text-text text-center px-4 line-clamp-1">{course.courseName}</span>
                        <span className="text-[10px] text-text/40 uppercase font-black">{materials.filter(m => m.course?._id === course._id).length} Files</span>
                    </motion.div>
                ))}
            </div>

            {/* Materials List */}
            <div className="glass-card !p-0 overflow-hidden shadow-2xl shadow-lg">
                <div className="p-6 border-b border-border bg-card flex justify-between items-center">
                    <div>
                        <h3 className="font-black text-text uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-accent" />
                            {selectedCourse ? `${selectedCourse.courseCode} Resources` : 'Recent Uploads'}
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-[10px] font-black text-text/20 uppercase tracking-widest bg-card px-3 py-1 rounded-full border border-border">
                            {filteredMaterials.length} Items Found
                        </span>
                    </div>
                </div>
                
                <div className="divide-y divide-border">
                    {loading ? (
                        <div className="p-20 text-center text-text/20 italic">Scanning repository...</div>
                    ) : filteredMaterials.length === 0 ? (
                        <div className="p-20 text-center text-text/20 italic">
                            {selectedCourse ? 'No materials uploaded for this course yet.' : 'Your knowledge base is empty.'}
                        </div>
                    ) : (
                        filteredMaterials.map((file, i) => (
                            <motion.div 
                                key={file._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 hover:bg-card transition-all group gap-4"
                            >
                                <div className="flex items-center gap-4 md:gap-6">
                                    <div className="w-12 h-12 md:w-14 md:h-14 bg-card rounded-xl md:rounded-2xl flex items-center justify-center text-text/20 group-hover:text-accent group-hover:bg-accent/10 transition-all shadow-inner shrink-0">
                                        <File className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-text group-hover:text-accent transition-colors truncate">{file.title}</p>
                                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1">
                                            <span className="text-[10px] font-black text-accent uppercase tracking-tighter bg-accent/10 px-2 py-0.5 rounded">
                                                {file.course?.courseCode}
                                            </span>
                                            <span className="text-[10px] font-black text-text/20 uppercase tracking-widest">{file.fileType}</span>
                                            <span className="hidden sm:inline text-[10px] text-text/10">•</span>
                                            <span className="text-[10px] font-black text-text/20 uppercase tracking-widest">{file.fileSize}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-border/50 pt-4 md:pt-0">
                                    <div className="text-left md:text-right">
                                        <p className="text-[10px] font-black text-text/20 uppercase tracking-widest">Uploaded On</p>
                                        <p className="text-xs font-bold text-text/40">{new Date(file.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <a 
                                            href={file.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2.5 md:p-3 bg-card hover:bg-accent hover:text-text rounded-xl text-text/40 transition-all border border-border hover:border-accent shadow-lg"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button className="p-2.5 md:p-3 bg-card hover:bg-rose-500/20 hover:text-rose-500 rounded-xl text-text/40 transition-all border border-border hover:border-rose-500/50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-overlay backdrop-blur-md">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="glass-card w-full max-w-lg relative shadow-2xl border-border"
                        >
                            <button 
                                onClick={() => setShowModal(false)}
                                className="absolute top-6 right-6 text-text/40 hover:text-text transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center text-accent shadow-lg shadow-accent/20">
                                    <Upload className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-text uppercase tracking-tight">Upload Resource</h3>
                                    <p className="text-[10px] font-black text-text/40 uppercase tracking-widest">Sync to Student Terminal</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Target Course</label>
                                    <select 
                                        required
                                        className="input-field w-full bg-background border-border focus:border-accent"
                                        value={formData.courseId}
                                        onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                                    >
                                        <option value="">Select a course...</option>
                                        {myCourses.map(c => (
                                            <option key={c._id} value={c._id}>{c.courseName} ({c.courseCode})</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Resource Title</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. Week 4 - Advanced Algorithms"
                                        className="input-field w-full border-border focus:border-accent"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">File Type</label>
                                        <select 
                                            className="input-field w-full bg-background border-border focus:border-accent"
                                            value={formData.fileType}
                                            onChange={(e) => setFormData({...formData, fileType: e.target.value})}
                                        >
                                            <option value="PDF">PDF Document</option>
                                            <option value="DOCX">Word Doc</option>
                                            <option value="PPTX">PowerPoint</option>
                                            <option value="ZIP">Archive</option>
                                            <option value="LINK">External Link</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Resource Link</label>
                                        <input 
                                            type="url" 
                                            required
                                            placeholder="https://..."
                                            className="input-field w-full border-border focus:border-accent"
                                            value={formData.fileUrl}
                                            onChange={(e) => setFormData({...formData, fileUrl: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Brief Description</label>
                                    <textarea 
                                        rows="3"
                                        placeholder="Optional notes for students..."
                                        className="input-field w-full resize-none border-border focus:border-accent"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn-primary w-full py-5 font-black text-lg shadow-2xl shadow-accent/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-transform"
                                >
                                    <Send className="w-5 h-5" /> Deploy Resource
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseMaterials;


