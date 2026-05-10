import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, Search, CheckCircle, AlertCircle, FileText, Hash, Calendar, DollarSign } from 'lucide-react';

const FeeManagement = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const { data } = await axios.get('/api/finance/fees', {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            setFees(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching fees');
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`/api/finance/fees/${id}`, { status }, {
                headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}` }
            });
            fetchFees();
        } catch (error) {
            alert('Error updating fee status');
        }
    };

    const filteredFees = fees.filter(f => 
        f.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.student?.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text tracking-tight">Finance Administration</h2>
                    <p className="text-text/60">Review payments and verify student transaction IDs.</p>
                </div>
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                    <input 
                        type="text" 
                        placeholder="Search student or TRX ID..." 
                        className="input-field pl-10 w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-card flex items-center gap-4 border-teal-500/20">
                    <div className="w-12 h-12 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-500">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-text/40">Total Collected</p>
                        <h4 className="text-2xl font-bold text-text">
                            {fees.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amount, 0).toLocaleString()} PKR
                        </h4>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4 border-rose-500/20">
                    <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-text/40">Outstanding</p>
                        <h4 className="text-2xl font-bold text-text">
                            {fees.filter(f => f.status === 'Pending').reduce((acc, f) => acc + f.amount, 0).toLocaleString()} PKR
                        </h4>
                    </div>
                </div>
                <div className="glass-card flex items-center gap-4 border-accent/20">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black text-text/40">Total Receivables</p>
                        <h4 className="text-2xl font-bold text-text">
                            {fees.reduce((acc, f) => acc + f.amount, 0).toLocaleString()} PKR
                        </h4>
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden !p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-card border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-text/80">Student Info</th>
                                <th className="px-6 py-4 font-semibold text-text/80">Transaction ID</th>
                                <th className="px-6 py-4 font-semibold text-text/80">Amount</th>
                                <th className="px-6 py-4 font-semibold text-text/80 text-center">Status</th>
                                <th className="px-6 py-4 text-right text-text/80">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-text/40 italic">Loading records...</td></tr>
                            ) : filteredFees.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-10 text-center text-text/40 italic">No records matching your search.</td></tr>
                            ) : (
                                filteredFees.map(fee => (
                                    <tr key={fee._id} className="hover:bg-card transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-text">{fee.student?.name}</div>
                                            <div className="text-[10px] font-black text-accent uppercase">{fee.student?.rollNumber}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {fee.transactionId ? (
                                                <div className="flex items-center gap-2">
                                                    <Hash className="w-3 h-3 text-accent/40" />
                                                    <span className="text-sm font-mono text-text/80 bg-card px-2 py-1 rounded">{fee.transactionId}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-text/20 italic">No ID Submitted</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-text">{fee.amount.toLocaleString()} PKR</div>
                                            <div className="text-[10px] text-text/40 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Due: {new Date(fee.dueDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                    fee.status === 'Paid' 
                                                    ? 'bg-teal-500/10 text-teal-500 border-teal-500/20' 
                                                    : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                }`}>
                                                    {fee.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => updateStatus(fee._id, fee.status === 'Paid' ? 'Pending' : 'Paid')}
                                                className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                                                    fee.status === 'Paid'
                                                    ? 'text-rose-400 hover:bg-rose-400/10'
                                                    : 'text-teal-400 hover:bg-teal-400/10 border border-teal-400/20'
                                                }`}
                                            >
                                                {fee.status === 'Paid' ? 'Revoke Payment' : 'Verify & Confirm'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FeeManagement;


