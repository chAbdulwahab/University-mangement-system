import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Search, GraduationCap, X, User, Mail, Lock, BookOpen, Hash, Plus, Edit2, BookPlus, Eye, EyeOff } from 'lucide-react';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        department: '',
        rollNumber: '',
        semester: 1,
        role: 'Student'
    });

    useEffect(() => {
        fetchStudents();
        fetchDepartments();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get('/api/admin/students', {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setStudents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students', error);
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

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/users', formData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            alert('Student registered successfully!');
            setShowAddModal(false);
            setFormData({ name: '', email: '', password: '', department: '', rollNumber: '', semester: 1, role: 'Student' });
            fetchStudents();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to register student');
        }
    };

    const openEditModal = (student) => {
        setEditingStudent(student);
        setFormData({
            name: student.name,
            email: student.email,
            department: student.department || '',
            rollNumber: student.rollNumber || '',
            semester: student.semester || 1,
            role: 'Student'
        });
        setShowEditModal(true);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/api/admin/users/${editingStudent._id}`, formData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            alert('Student updated successfully!');
            setShowEditModal(false);
            setEditingStudent(null);
            setFormData({ name: '', email: '', password: '', department: '', rollNumber: '', semester: 1, role: 'Student' });
            fetchStudents();
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Failed to update student';
            alert(`Error: ${errorMsg}`);
        }
    };

    const deleteStudent = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`/api/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
                });
                setStudents(students.filter(s => s._id !== id));
            } catch (error) {
                alert('Failed to delete student');
            }
        }
    };

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-end items-center gap-4">
                <div className="relative group">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text/30 group-focus-within:text-accent transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Filter records..." 
                        className="bg-card/50 border border-border/50 rounded-2xl py-2.5 pl-10 pr-6 text-sm w-64 focus:outline-none focus:border-accent/50 focus:w-80 transition-all text-text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-2.5"
                >
                    <UserPlus className="w-5 h-5" /> Add Student
                </button>
            </div>

            <div className="glass-card overflow-hidden !p-0">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-card border-b border-border">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-text/80">Student Name</th>
                            <th className="px-6 py-4 font-semibold text-text/80">Roll Number</th>
                            <th className="px-6 py-4 font-semibold text-text/80">Dept</th>
                            <th className="px-6 py-4 font-semibold text-text/80">Sem</th>
                            <th className="px-6 py-4 font-semibold text-text/80">Email</th>
                            <th className="px-6 py-4 font-semibold text-right text-text/80">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-text/40 italic">Loading students...</td></tr>
                        ) : filteredStudents.length === 0 ? (
                            <tr><td colSpan="6" className="px-6 py-10 text-center text-text/40 italic">No students found.</td></tr>
                        ) : (
                            filteredStudents.map((student) => (
                                <motion.tr 
                                    key={student._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="hover:bg-card transition-colors"
                                >
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-text/90">{student.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-text/60">{student.rollNumber || 'N/A'}</td>
                                    <td className="px-6 py-4 text-text/60">{student.department || 'General'}</td>
                                    <td className="px-6 py-4 text-text/60 font-mono text-xs">SEM {student.semester || 1}</td>
                                    <td className="px-6 py-4 text-text/60">{student.email}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openEditModal(student)}
                                                className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-all"
                                                title="Edit Student"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => deleteStudent(student._id)}
                                                className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                                title="Delete Student"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Student Modal */}
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
                                <Plus className="text-accent" /> Register New Student
                            </h3>

                            <form onSubmit={handleAddStudent} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-text/60 flex items-center gap-2">
                                        <User className="w-4 h-4" /> Full Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        className="input-field w-full"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm text-text/60 flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email Address
                                        </label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            required
                                            className="input-field w-full"
                                            placeholder="john@edu.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm text-text/60 flex items-center gap-2">
                                            <Lock className="w-4 h-4" /> Password
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                className="input-field w-full pr-10"
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm text-text/60 flex items-center gap-2">
                                            <Hash className="w-4 h-4" /> Roll Number
                                        </label>
                                        <input 
                                            type="text" 
                                            name="rollNumber"
                                            required
                                            className="input-field w-full"
                                            placeholder="CS101-2024"
                                            value={formData.rollNumber}
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
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm text-text/60 flex items-center gap-2">
                                        <BookPlus className="w-4 h-4" /> Current Semester
                                    </label>
                                    <input 
                                        type="number" 
                                        name="semester"
                                        min="1"
                                        max="12"
                                        required
                                        className="input-field w-full"
                                        value={formData.semester}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn-primary w-full py-3 text-lg font-semibold">
                                        Register Student
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Student Modal */}
            <AnimatePresence>
                {showEditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="glass-card w-full max-w-md relative"
                        >
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="absolute top-4 right-4 text-text/40 hover:text-text"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <Edit2 className="text-accent" /> Edit Student Details
                            </h3>
                            <p className="text-text/40 mb-6 text-sm">Updating: {editingStudent?.name}</p>

                            <form onSubmit={handleUpdateStudent} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm text-text/60">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        required
                                        className="input-field w-full"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm text-text/60">Roll Number</label>
                                        <input 
                                            type="text" 
                                            name="rollNumber"
                                            required
                                            className="input-field w-full"
                                            value={formData.rollNumber}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm text-text/60">Semester</label>
                                        <input 
                                            type="number" 
                                            name="semester"
                                            min="1"
                                            max="12"
                                            required
                                            className="input-field w-full"
                                            value={formData.semester}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm text-text/60">Department</label>
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
                                        Save Changes
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

export default StudentManagement;


