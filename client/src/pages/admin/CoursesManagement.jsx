import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BookPlus, Book, User, Layers, X, Check, Edit2 } from 'lucide-react';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    
    const [formData, setFormData] = useState({
        courseName: '',
        courseCode: '',
        creditHours: 3,
        semester: 1,
        department: '',
        teacherId: '',
        schedule: '',
        location: ''
    });

    useEffect(() => {
        fetchCourses();
        fetchDepartments();
        fetchTeachers();
    }, []);

    const fetchCourses = async () => {
        try {
            const { data } = await axios.get('/api/courses', {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setCourses(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching courses', error);
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const { data } = await axios.get('/api/admin/departments', {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments', error);
        }
    };

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get('/api/admin/teachers', {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setTeachers(data);
        } catch (error) {
            console.error('Error fetching teachers', error);
        }
    };

    const handleAddCourse = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/courses', formData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setShowAddModal(false);
            setFormData({ courseName: '', courseCode: '', creditHours: 3, semester: 1, department: '', teacherId: '', schedule: '', location: '' });
            fetchCourses();
            alert('Course created successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add course');
        }
    };

    const handleAssignTeacher = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/courses/${selectedCourse._id}`, { 
                teacherId: formData.teacherId,
                schedule: formData.schedule,
                location: formData.location
            }, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setShowAssignModal(false);
            setSelectedCourse(null);
            setFormData({ ...formData, teacherId: '', schedule: '', location: '' });
            fetchCourses();
            alert('Course details updated successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to update course details');
        }
    };

    const openAssignModal = (course) => {
        setSelectedCourse(course);
        setFormData({ 
            ...formData, 
            teacherId: course.teacher?._id || '',
            schedule: course.schedule || '',
            location: course.location || ''
        });
        setShowAssignModal(true);
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text">Course Catalog</h2>
                    <p className="text-text/60">Manage university curriculum and assignments.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <BookPlus className="w-5 h-5" /> Add New Course
                </button>
            </header>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-text/40 italic">Loading curriculum...</div>
                ) : courses.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-text/40 italic">No courses found.</div>
                ) : (
                    courses.map((course) => (
                        <motion.div 
                            key={course._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card hover:border-accent/50 transition-all group relative"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-text transition-all">
                                    <Book className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold bg-card px-2 py-1 rounded text-text/60">
                                    SEM {course.semester}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-text mb-1">{course.courseName}</h3>
                            <p className="text-accent text-sm font-mono mb-4">{course.courseCode}</p>
                            
                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-sm text-text/60">
                                    <Layers className="w-4 h-4" /> {course.department}
                                </div>
                                <div className="flex items-center justify-between group/teacher">
                                    <div className="flex items-center gap-2 text-sm text-text/60">
                                        <User className="w-4 h-4" /> {course.teacher?.name || <span className="text-rose-400/60 italic">Unassigned</span>}
                                    </div>
                                    <button 
                                        onClick={() => openAssignModal(course)}
                                        className="p-1.5 hover:bg-card rounded-lg text-accent transition-colors"
                                        title="Edit Course Details"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-text/40 font-mono">
                                    <span>{course.schedule || 'No Schedule'}</span>
                                    <span>•</span>
                                    <span>{course.location || 'No Room'}</span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-xs font-medium text-text/40">{course.creditHours} Credits</span>
                                    <span className="text-xs font-medium text-text/40">{course.students?.length || 0} Students</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add Course Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card w-full max-w-md relative"
                        >
                            <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-text/40 hover:text-text">
                                <X className="w-6 h-6" />
                            </button>
                            <h3 className="text-2xl font-bold text-text mb-6">Create New Course</h3>
                            <form onSubmit={handleAddCourse} className="space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Course Name" 
                                    className="input-field"
                                    value={formData.courseName}
                                    onChange={(e) => setFormData({...formData, courseName: e.target.value})}
                                    required
                                />
                                <input 
                                    type="text" 
                                    placeholder="Course Code (e.g. CS101)" 
                                    className="input-field"
                                    value={formData.courseCode}
                                    onChange={(e) => setFormData({...formData, courseCode: e.target.value})}
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        type="number" 
                                        placeholder="Credits" 
                                        className="input-field"
                                        value={formData.creditHours}
                                        onChange={(e) => setFormData({...formData, creditHours: e.target.value})}
                                        required
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="Semester" 
                                        className="input-field"
                                        value={formData.semester}
                                        onChange={(e) => setFormData({...formData, semester: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input 
                                        type="text" 
                                        placeholder="Schedule (e.g. Mon 09:00 AM)" 
                                        className="input-field"
                                        value={formData.schedule}
                                        onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Location (e.g. Hall A)" 
                                        className="input-field"
                                        value={formData.location}
                                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <select 
                                        className="input-field bg-slate-800"
                                        value={formData.department}
                                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                                        required
                                    >
                                        <option value="">Department</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept.name}>{dept.name}</option>
                                        ))}
                                    </select>
                                    <select 
                                        className="input-field bg-slate-800"
                                        value={formData.teacherId}
                                        onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                                    >
                                        <option value="">Assign Teacher</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher._id} value={teacher._id}>{teacher.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pt-4">
                                    <button type="submit" className="btn-primary w-full py-3">Create Course</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Assign Teacher Modal */}
            <AnimatePresence>
                {showAssignModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card w-full max-w-sm relative"
                        >
                            <button onClick={() => setShowAssignModal(false)} className="absolute top-4 right-4 text-text/40 hover:text-text">
                                <X className="w-6 h-6" />
                            </button>
                            <h3 className="text-xl font-bold text-text mb-2">Edit Course Details</h3>
                            <p className="text-text/60 mb-6 text-sm">Course: <span className="text-accent">{selectedCourse?.courseName}</span></p>
                            
                            <form onSubmit={handleAssignTeacher} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs text-text/40 uppercase font-bold tracking-wider">Instructor</label>
                                    <select 
                                        className="input-field bg-slate-800 w-full"
                                        value={formData.teacherId}
                                        onChange={(e) => setFormData({...formData, teacherId: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Teacher</option>
                                        {teachers.map(teacher => (
                                            <option key={teacher._id} value={teacher._id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-text/40 uppercase font-bold tracking-wider">Schedule</label>
                                        <input 
                                            type="text" 
                                            className="input-field w-full"
                                            placeholder="e.g. 09:00 AM"
                                            value={formData.schedule}
                                            onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-text/40 uppercase font-bold tracking-wider">Location</label>
                                        <input 
                                            type="text" 
                                            className="input-field w-full"
                                            placeholder="e.g. Hall A"
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                        <Check className="w-4 h-4" /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CourseManagement;


