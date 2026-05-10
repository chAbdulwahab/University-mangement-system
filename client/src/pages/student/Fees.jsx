import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle, AlertCircle, Receipt, BookOpen, Calculator, PlayCircle, Hash, Book, Clock, X, Send, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';

const Fees = () => {
    const { user } = useSelector((state) => state.auth);
    const [feeStats, setFeeStats] = useState(null);
    const [isPaid, setIsPaid] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPayModal, setShowPayModal] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [calcRes, myFeesRes] = await Promise.all([
                axios.get('/api/finance/calculate-fees', config),
                axios.get('/api/finance/my-fees', config)
            ]);
            
            setFeeStats(calcRes.data);
            
            // Check if there is any 'Paid' record
            const paidStatus = myFeesRes.data.some(f => f.status === 'Paid');
            setIsPaid(paidStatus);
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching fees', error);
            setLoading(false);
        }
    };

    const handleDownload = () => {
        window.print();
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        if (!transactionId.trim()) return alert('Please enter a Transaction ID');

        setSubmitting(true);
        try {
            await axios.post('/api/finance/pay', {
                amount: feeStats.totalAmount,
                transactionId: transactionId
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            alert('Payment submitted successfully! Admin will verify your transaction.');
            setShowPayModal(false);
            setTransactionId('');
            fetchData(); // Refresh state
        } catch (error) {
            alert('Failed to submit payment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 print:m-0 print:p-0">
            <header className="print:hidden">
                <h2 className="text-3xl font-bold text-text">Financial Standing</h2>
                <p className="text-text/40">Tuition calculated at 8,000 PKR per credit hour.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="py-20 text-center italic text-text/20 print:hidden">Calculating tuition...</div>
                    ) : !feeStats || feeStats.details.length === 0 ? (
                        <div className="glass-card py-20 text-center text-text/40 print:hidden">
                            <Book className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No courses enrolled. Enroll in subjects to generate your fee voucher.</p>
                        </div>
                    ) : (
                        <>
                            <div className="glass-card bg-card border-border print:bg-white print:text-black print:border-black print:shadow-none">
                                <div className="hidden print:block mb-10 text-center border-b-2 border-black pb-6">
                                    <h1 className="text-3xl font-black uppercase tracking-tighter">University Fee Challan</h1>
                                    <p className="text-sm font-bold mt-2">Student Name: {user?.name} | Roll No: {user?.rollNumber || 'N/A'}</p>
                                    <p className="text-xs mt-1">Date: {new Date().toLocaleDateString()}</p>
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-text print:text-black">
                                        <Receipt className="w-5 h-5 text-accent print:hidden" /> Semester Fee Breakdown
                                    </h3>
                                    {isPaid && (
                                        <div className="flex items-center gap-2 bg-teal-500/10 text-teal-400 px-3 py-1 rounded-lg border border-teal-500/20 print:hidden">
                                            <ShieldCheck className="w-4 h-4" />
                                            <span className="text-[10px] font-black uppercase">Payment Verified</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="space-y-4">
                                    {feeStats.details.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-card rounded-2xl border border-border print:border-black print:rounded-none">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent font-bold text-xs print:border print:border-black">
                                                    {item.credits}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-text text-sm print:text-black">{item.name}</h4>
                                                    <span className="text-[10px] text-text/40 uppercase font-black print:text-black/60">{item.lectures} Lectures Total</span>
                                                </div>
                                            </div>
                                            <div className="text-sm font-bold text-text/80 print:text-black">
                                                {item.subtotal.toLocaleString()} PKR
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <div className="pt-6 border-t border-border mt-6 flex justify-between items-end print:border-black">
                                        <div>
                                            <p className="text-[10px] text-text/40 uppercase font-black mb-1 print:text-black/60">Total Credit Hours</p>
                                            <p className="text-2xl font-black text-text print:text-black">{feeStats.totalCredits}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-text/40 uppercase font-black mb-1 print:text-black/60">Total Amount Payable</p>
                                            <p className="text-3xl font-black text-accent print:text-black">{feeStats.totalAmount.toLocaleString()} PKR</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden print:block mt-12 pt-12 border-t border-dashed border-black">
                                    <div className="flex justify-between">
                                        <div className="text-center w-40 border-t border-black pt-2 text-[10px]">Student Signature</div>
                                        <div className="text-center w-40 border-t border-black pt-2 text-[10px]">Bank Official Stamp</div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-6 print:hidden">
                    <div className={`glass-card text-center border-border ${isPaid ? 'bg-teal-500/5 border-teal-500/20' : 'bg-gradient-to-br from-accent/20 to-transparent border-accent/20'}`}>
                        <h3 className="text-xl font-bold mb-6 text-text">Voucher Status</h3>
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border ${isPaid ? 'bg-teal-500/20 border-teal-500/30' : 'bg-accent/20 border-accent/30'}`}>
                            {isPaid ? <CheckCircle className="w-10 h-10 text-teal-400" /> : <Hash className="w-10 h-10 text-accent/40" />}
                        </div>
                        
                        <div className="mb-8">
                            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                                isPaid 
                                ? 'text-teal-400 bg-teal-400/10 border-teal-400/20' 
                                : 'text-rose-400 bg-rose-400/10 border-rose-400/20'
                            }`}>
                                {isPaid ? 'Payment Confirmed' : 'Payment Pending'}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={handleDownload}
                                className="w-full py-3 bg-card hover:bg-card text-text border border-border rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <Receipt className="w-4 h-4" /> {isPaid ? 'View Receipt' : 'View / Print Challan'}
                            </button>
                            
                            {!isPaid && (
                                <button 
                                    onClick={() => setShowPayModal(true)}
                                    className="btn-primary w-full py-3 font-bold shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-4 h-4" /> Submit Payment Info
                                </button>
                            )}

                            {isPaid && (
                                <div className="p-3 bg-teal-500/5 rounded-xl border border-teal-500/10 text-[10px] text-teal-400 font-bold uppercase">
                                    Your payment has been verified by the accounts department.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass-card">
                        <h3 className="text-[10px] font-black mb-4 text-text/20 uppercase tracking-[0.2em]">Bank Details</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-card rounded-xl border border-border">
                                <p className="text-[10px] text-text/20 font-black uppercase">Account Title</p>
                                <p className="text-xs text-text font-medium">University Management System</p>
                            </div>
                            <div className="p-3 bg-card rounded-xl border border-border">
                                <p className="text-[10px] text-text/20 font-black uppercase">Account Number</p>
                                <p className="text-xs text-text font-medium">PK00 HABB 0011 2233 4455</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Submission Modal */}
            <AnimatePresence>
                {showPayModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card w-full max-w-md relative"
                        >
                            <button 
                                onClick={() => setShowPayModal(false)}
                                className="absolute top-4 right-4 text-text/40 hover:text-text"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2 text-text">
                                <CreditCard className="text-accent" /> Confirm Payment
                            </h3>
                            <p className="text-text/40 mb-6 text-sm">Enter your transaction details to notify the administration.</p>

                            <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] text-text/40 uppercase font-black">Payable Amount</label>
                                    <div className="text-2xl font-black text-text">{feeStats?.totalAmount.toLocaleString()} PKR</div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-text/40 uppercase font-black">Transaction ID / Reference No</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g. TRX-123456789"
                                        className="input-field w-full"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                    <p className="text-[10px] text-text/20">Provide the ID from your bank receipt or mobile app transfer.</p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="btn-primary w-full py-4 font-bold text-lg shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                                >
                                    {submitting ? 'Submitting...' : 'Confirm Payment'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Fees;


