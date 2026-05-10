import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, GraduationCap, Briefcase, Edit3, Save, X } from 'lucide-react';
import { updateProfile } from '../../redux/authSlice';

const TeacherProfile = () => {
    const dispatch = useDispatch();
    const { user, isLoading } = useSelector((state) => state.auth);
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        department: user?.department || 'CS Department',
    });

    const { name, email, department } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(formData));
        setIsEditing(false);
    };

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-text tracking-tight">Faculty Profile</h2>
                    <p className="text-text/40 mt-2 font-medium uppercase tracking-widest text-xs">University ID: {user?._id?.slice(-8)}</p>
                </div>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="bg-card hover:bg-card text-text px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <X className="w-4 h-4" /> Cancel
                        </button>
                        <button 
                            onClick={onSubmit}
                            disabled={isLoading}
                            className="btn-accent flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass-card flex flex-col items-center text-center py-12 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 bg-accent rounded-full flex items-center justify-center text-text text-5xl font-black shadow-2xl shadow-accent/20">
                            {user?.name?.[0]}
                        </div>
                        <div className="absolute bottom-1 right-1 w-8 h-8 bg-teal-500 rounded-full border-4 border-background flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    
                    {isEditing ? (
                        <div className="w-full px-4 space-y-4">
                            <input 
                                type="text" 
                                name="name"
                                value={name}
                                onChange={onChange}
                                className="input-field text-center font-bold"
                                placeholder="Full Name"
                            />
                            <input 
                                type="text" 
                                name="department"
                                value={department}
                                onChange={onChange}
                                className="input-field text-center text-accent text-sm"
                                placeholder="Department"
                            />
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold text-text">{user?.name}</h3>
                            <p className="text-accent font-medium mt-1">{user?.department || 'Senior Professor • CS Department'}</p>
                        </>
                    )}
                    
                    <div className="mt-6 px-4 py-1 bg-card rounded-full border border-border text-[10px] text-text/40 font-black uppercase tracking-widest">
                        Faculty Member since {new Date(user?.createdAt).getFullYear() || 2024}
                    </div>
                </div>

                {/* Info Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-text/20 uppercase tracking-[0.2em]">Contact Details</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-text/80">
                                    <Mail className="w-4 h-4 text-accent" />
                                    {isEditing ? (
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            className="bg-transparent border-b border-border focus:border-accent outline-none text-sm w-full"
                                        />
                                    ) : (
                                        <span className="text-sm">{user?.email}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-text/80">
                                    <User className="w-4 h-4 text-accent" />
                                    <span className="text-sm">@{user?.name?.replace(' ', '').toLowerCase()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-text/20 uppercase tracking-[0.2em]">Academic info</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-text/80">
                                    <Briefcase className="w-4 h-4 text-accent" />
                                    <span className="text-sm">{user?.role} Faculty</span>
                                </div>
                                <div className="flex items-center gap-3 text-text/80">
                                    <GraduationCap className="w-4 h-4 text-accent" />
                                    <span className="text-sm">Expert in {user?.department || 'Academic Research'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h4 className="text-sm font-black text-text/20 uppercase tracking-[0.2em] mb-6">Expertise & Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Machine Learning', 'Data Science', 'Cloud Computing', 'Neural Networks', 'Academic Research'].map((skill, i) => (
                                <span key={i} className="px-4 py-2 bg-card rounded-xl border border-border text-sm text-text/60 hover:border-accent/30 transition-all cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;


