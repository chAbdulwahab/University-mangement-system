import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, Book, BarChart3, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';

const ResultView = () => {
    const { user } = useSelector((state) => state.auth);
    const [gpaData, setGpaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [semester, setSemester] = useState(1);

    useEffect(() => {
        fetchResults();
    }, [semester]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/academic/gpa/${user._id}/${semester}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setGpaData(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching results');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-4xl font-black text-text tracking-tight uppercase">Transcript</h2>
                    <p className="text-text/40 mt-1 uppercase tracking-widest text-[10px] font-bold">Academic Achievement Terminal</p>
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-[10px] font-black text-text/40 uppercase tracking-widest">Select Semester</label>
                    <select 
                        value={semester} 
                        onChange={(e) => setSemester(e.target.value)}
                        className="input-field w-44 bg-background font-bold"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                            <option key={s} value={s}>Semester 0{s}</option>
                        ))}
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card bg-gradient-to-br from-accent/20 to-transparent border-accent/30 relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 rounded-full blur-3xl group-hover:bg-accent/20 transition-all"></div>
                    <TrendingUp className="text-accent mb-6 w-10 h-10" />
                    <p className="text-[10px] text-text/40 uppercase tracking-[0.2em] font-black mb-1">Semester GPA</p>
                    <h3 className="text-6xl font-black text-text tracking-tighter">{gpaData?.gpa || '0.00'}</h3>
                    <div className="mt-6 flex items-center gap-2 text-teal-400 font-bold text-[10px] uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-teal-400" /> Academic Status: Good Standing
                    </div>
                </motion.div>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card flex items-center gap-6 group hover:border-border transition-all shadow-xl">
                        <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center group-hover:bg-accent/10 transition-all">
                            <Book className="text-text/40 group-hover:text-accent w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] text-text/40 uppercase tracking-widest font-black">Credits Earned</p>
                            <h4 className="text-3xl font-black text-text tracking-tight">{gpaData?.totalCredits || 0}</h4>
                        </div>
                    </div>
                    <div className="glass-card flex items-center gap-6 group hover:border-border transition-all shadow-xl">
                        <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center group-hover:bg-teal-500/10 transition-all">
                            <Award className="text-text/40 group-hover:text-teal-400 w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-[10px] text-text/40 uppercase tracking-widest font-black">Courses Cleared</p>
                            <h4 className="text-3xl font-black text-text tracking-tight">{gpaData?.courses || 0}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-card !p-0 overflow-hidden border-border shadow-2xl">
                <div className="p-8 border-b border-border flex items-center justify-between bg-card">
                    <div className="flex items-center gap-3">
                        <BarChart3 className="text-accent w-6 h-6" />
                        <div>
                            <h3 className="text-xl font-black text-text">Academic Breakdown</h3>
                            <p className="text-[10px] font-black text-text/40 uppercase tracking-widest">Semester {semester} Detailed Report</p>
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <div className="text-center py-20 text-text/20 italic font-medium tracking-widest uppercase text-[10px]">Processing Transcript...</div>
                ) : !gpaData?.results || gpaData.results.length === 0 ? (
                    <div className="text-center py-24 text-text/20">
                         <div className="border border-border inline-block p-10 rounded-full border-dashed mb-6">
                            <Star className="w-12 h-12 opacity-10" />
                         </div>
                        <p className="font-black uppercase tracking-widest text-[10px]">No results published for this semester yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-card">
                                    <th className="px-8 py-5 font-black text-text/60 uppercase text-[10px] tracking-[0.2em]">Course Name</th>
                                    <th className="px-8 py-5 font-black text-text/60 uppercase text-[10px] tracking-[0.2em]">Course Code</th>
                                    <th className="px-8 py-5 font-black text-text/60 uppercase text-[10px] tracking-[0.2em] text-center">Marks</th>
                                    <th className="px-8 py-5 font-black text-text/60 uppercase text-[10px] tracking-[0.2em] text-center">Grade</th>
                                    <th className="px-8 py-5 font-black text-text/60 uppercase text-[10px] tracking-[0.2em] text-right">Points</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {gpaData.results.map((r, i) => (
                                    <tr key={i} className="hover:bg-card transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1 h-8 bg-accent/20 rounded-full group-hover:bg-accent transition-all"></div>
                                                <span className="font-bold text-text tracking-tight">{r.courseName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-black text-accent bg-accent/5 px-3 py-1 rounded border border-accent/10 uppercase">
                                                {r.courseCode}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center font-bold text-text/80">{r.marks}</td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`inline-block w-8 h-8 leading-8 rounded-lg font-black text-xs ${
                                                r.grade === 'A' ? 'bg-teal-500/20 text-teal-400' : 
                                                r.grade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                                                r.grade === 'F' ? 'bg-rose-500/20 text-rose-400' : 'bg-card text-text'
                                            }`}>
                                                {r.grade}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right font-black text-text">{r.gp.toFixed(1)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultView;


