import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Trash2, Search, Briefcase, Plus, X, User, Mail, Lock, BookOpen } from 'lucide-react';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        role: 'Teacher'
    });

    useEffect(() => {
        fetchTeachers();
        fetchDepartments();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await axios.get('/api/admin/teachers', { 
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setTeachers(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching teachers', error);
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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddTeacher = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/users', formData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            alert('Faculty member added successfully!');
            setShowAddModal(false);
            setFormData({ name: '', email: '', password: '', department: '', role: 'Teacher' });
            fetchTeachers();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add faculty member');
        }
    };

    const deleteTeacher = async (id) => {
        if (window.confirm('Are you sure you want to remove this teacher?')) {
            try {
                await axios.delete(`/api/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
                });
                setTeachers(teachers.filter(t => t._id !== id));
            } catch (error) {
                alert('Failed to delete teacher');
            }
        }
    };

    const filteredTeachers = teachers.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-end items-center gap-4">
                <div className="relative group">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-accent transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Filter faculty..." 
                        className="bg-card/50 border border-border/50 rounded-2xl py-2.5 pl-10 pr-6 text-sm w-64 focus:outline-none focus:border-accent/50 focus:w-80 transition-all text-text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5"
                >
                    <Plus className="w-5 h-5" /> Add Faculty
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-text/40 italic">Loading faculty list...</div>
                ) : filteredTeachers.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-text/40 italic">No faculty members found.</div>
                ) : (
                    filteredTeachers.map((teacher) => (
                        <motion.div 
                            key={teacher._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card flex flex-col items-center text-center group relative overflow-hidden"
                        >
                            <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4 border-2 border-accent/20 group-hover:border-accent transition-all">
                                <UserCheck className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-text">{teacher.name}</h3>
                            <p className="text-accent text-sm mb-4 font-medium">{teacher.department || 'Academic Staff'}</p>
                            
                            <div className="w-full pt-4 border-t border-border space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text/40">Email:</span>
                                    <span className="text-text/80">{teacher.email}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text/40">Assigned Courses:</span>
                                    <span className="text-text/80">{teacher.assignedCourses?.length || 0}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => deleteTeacher(teacher._id)}
                                className="mt-6 w-full py-2 text-rose-400 hover:bg-rose-500/10 rounded-lg border border-rose-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Remove Teacher
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add Faculty Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card w-full max-w-md relative"
                        >
                            <button 
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-4 right-4 text-text/40 hover:text-text"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Plus className="text-accent" /> Add New Faculty
                            </h3>

                            <form onSubmit={handleAddTeacher} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-text/60 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        className="input-field w-full"
                                        placeholder="Dr. Sarah Johnson"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm text-text/60 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email Address
                                    </label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        required
                                        className="input-field w-full"
                                        placeholder="sarah@university.edu"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm text-text/60 flex items-center gap-2">
                                        <Lock className="w-4 h-4" /> Password
                                    </label>
                                    <input 
                                        type="password" 
                                        name="password"
                                        required
                                        className="input-field w-full"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm text-text/60 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" /> Department
                                    </label>
                                    <select 
                                        name="department"
                                        required
                                        className="input-field w-full bg-slate-800"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept.name}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn-primary w-full py-3 text-lg font-semibold">
                                        Register Faculty Member
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

export default TeacherManagement;




