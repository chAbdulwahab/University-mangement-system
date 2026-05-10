import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Landmark, Plus, Search, Users, Book } from 'lucide-react';

const DepartmentManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', code: '' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const { data } = await axios.get('/api/admin/departments', {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setDepartments(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching departments', error);
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/departments', formData, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setShowAddModal(false);
            setFormData({ name: '', code: '' });
            fetchDepartments();
            alert('Department added successfully!');
        } catch (error) {
            const errorMsg = error.response?.data?.error 
                ? `${error.response.data.message}: ${error.response.data.error}`
                : (error.response?.data?.message || 'Failed to add department');
            alert(errorMsg);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Academic Departments</h2>
                    <p className="text-text/60">Organize university faculties and resources.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> New Department
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-20 text-text/40 italic">Loading departments...</div>
                ) : (
                    departments.map((dept) => (
                        <motion.div 
                            key={dept._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
                                    <Landmark className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{dept.name}</h3>
                                    <span className="text-accent text-sm font-mono">{dept.code}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-card rounded-xl p-4 text-center">
                                    <Users className="w-5 h-5 mx-auto mb-2 text-text/40" />
                                    <span className="block text-lg font-bold text-text">{dept.facultyCount || 0}</span>
                                    <span className="text-xs text-text/40 uppercase">Faculty</span>
                                </div>
                                <div className="bg-card rounded-xl p-4 text-center">
                                    <Book className="w-5 h-5 mx-auto mb-2 text-text/40" />
                                    <span className="block text-lg font-bold text-text">{dept.courseCount || 0}</span>
                                    <span className="text-xs text-text/40 uppercase">Courses</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card w-full max-w-md"
                    >
                        <h3 className="text-2xl font-bold mb-6">Create Department</h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <input 
                                type="text" 
                                placeholder="Department Name" 
                                className="input-field"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                            <input 
                                type="text" 
                                placeholder="Department Code (e.g. CS)" 
                                className="input-field"
                                value={formData.code}
                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                required
                            />
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="btn-primary flex-1">Create</button>
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddModal(false)}
                                    className="px-6 py-2 rounded-lg bg-card hover:bg-card transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DepartmentManagement;


