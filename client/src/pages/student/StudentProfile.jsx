import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, GraduationCap, Calendar, Settings, Camera } from 'lucide-react';

const StudentProfile = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-text tracking-tight">Personal Profile</h2>
                    <p className="text-text/40 mt-2 font-medium uppercase tracking-widest text-xs">University ID: {user?._id?.slice(-8)}</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="glass-card flex flex-col items-center text-center py-12 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
                    <div className="relative mb-6 group cursor-pointer">
                        <div className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center text-accent text-5xl font-black border-2 border-accent/30 overflow-hidden">
                            {user?.name?.[0]}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="text-text w-8 h-8" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold text-text">{user?.name}</h3>
                    <p className="text-accent font-medium mt-1">Undergraduate • Semester {user?.semester || '1'}</p>
                    <div className="mt-6 px-4 py-1 bg-card rounded-full border border-border text-[10px] text-text/40 font-black uppercase tracking-widest">
                        Status: Active
                    </div>
                </div>

                {/* Info Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="text-sm font-black text-text/20 uppercase tracking-[0.2em]">Contact info</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-text/80">
                                    <Mail className="w-4 h-4 text-accent" />
                                    <span className="text-sm">{user?.email}</span>
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
                                    <GraduationCap className="w-4 h-4 text-accent" />
                                    <span className="text-sm">B.S. in Computer Science</span>
                                </div>
                                <div className="flex items-center gap-3 text-text/80">
                                    <Calendar className="w-4 h-4 text-accent" />
                                    <span className="text-sm">Enrolled 2022</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h4 className="text-sm font-black text-text/20 uppercase tracking-[0.2em] mb-4">Account Security</h4>
                        <button className="text-xs font-bold text-accent hover:underline">Change Password →</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;


