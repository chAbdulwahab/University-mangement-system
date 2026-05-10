import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, MessageSquare, Sparkles, Brain, HelpCircle } from 'lucide-react';
import { useSelector } from 'react-redux';

const AIChatbot = () => {
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState([
        { 
            role: 'bot', 
            text: `Welcome, ${user?.name || 'User'}! I am the UMS Intelligence Engine. I have access to your role as a ${user?.role || 'Guest'} and can help you navigate the system.`,
            type: 'system'
        }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    // Knowledge Base - "Field Information"
    const UMS_KNOWLEDGE = {
        roles: {
            Admin: "Admins manage the entire campus: Students, Faculty, Finance, and Analytics.",
            Teacher: "Teachers manage Attendance, Course Materials, and Assignment grading.",
            Student: "Students can view Enrollments, Attendance records, Fees, and Results."
        },
        features: {
            analytics: "Real-time graphs showing revenue, enrollment trends, and department efficiency.",
            attendance: "Digital roll-call system for teachers. Students can view their percentage.",
            finance: "Digital fee portal with transaction history and payment status tracking.",
            materials: "Central repository for PDFs, lecture slides, and external research links."
        },
        technical: {
            database: "Powered by MongoDB Atlas for distributed, real-time data consistency.",
            theme: "Supports sleek Dark/Light modes via CSS variables and Tailwind customization.",
            security: "Uses JWT-based authentication and Role-Based Access Control (RBAC)."
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const getAIResponse = (query) => {
        const q = query.toLowerCase();
        
        // Help command
        if (q.includes('help') || q.includes('menu')) {
            return "I can help you with: \n• Navigating your dashboard\n• Understanding your permissions\n• Finding specific modules like Finance or Attendance\n• System technical specs";
        }

        // Contextual matching
        if (q.includes('role')) return `You are currently logged in as a ${user.role}. ${UMS_KNOWLEDGE.roles[user.role]}`;
        if (q.includes('analytics')) return `The Analytics Dashboard (${UMS_KNOWLEDGE.features.analytics}) is available in your sidebar.`;
        if (q.includes('fee') || q.includes('money')) return `Financial records are found in the Fees/Finance section. ${UMS_KNOWLEDGE.features.finance}`;
        if (q.includes('material') || q.includes('pdf')) return `Course materials are managed in the Knowledge Base. ${UMS_KNOWLEDGE.features.materials}`;
        if (q.includes('attendance')) return `The Roll Call system is fully digital. ${UMS_KNOWLEDGE.features.attendance}`;
        if (q.includes('tech') || q.includes('build')) return `The system is built on the MERN stack. ${UMS_KNOWLEDGE.technical.database}`;

        return "That's a great question about our University Management System! To give you a specific answer, could you tell me if you're looking for information about Finance, Academics, or your Profile settings?";
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate thinking and response
        setTimeout(() => {
            const botResponse = getAIResponse(input);
            setIsTyping(false);
            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        }, 800 + Math.random() * 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="glass-card w-[380px] h-[550px] mb-4 flex flex-col shadow-2xl border-accent/20 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-5 border-b border-border flex justify-between items-center bg-accent/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent via-teal-500 to-accent"></div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                                    <Brain className="text-text w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-text">UMS Core AI</h3>
                                    <p className="text-[10px] text-accent font-black uppercase tracking-widest">Active Assistant</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 text-text/40 hover:text-text hover:bg-text/5 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-background/50">
                            {messages.map((msg, i) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-accent text-text rounded-tr-none font-medium' 
                                        : 'bg-card text-text/80 rounded-tl-none border border-border'
                                    }`}>
                                        {msg.text.split('\n').map((line, index) => (
                                            <p key={index} className={index > 0 ? 'mt-2' : ''}>{line}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-card p-4 rounded-2xl rounded-tl-none border border-border flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Tips */}
                        <div className="px-5 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-border/30 bg-card/20">
                            {['Role Help', 'Finance', 'Nav Help'].map((tip) => (
                                <button 
                                    key={tip}
                                    onClick={() => setInput(tip)}
                                    className="text-[10px] font-bold text-text/40 hover:text-accent whitespace-nowrap bg-background/50 px-3 py-1.5 rounded-full border border-border hover:border-accent transition-all"
                                >
                                    {tip}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-card">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ask UMS AI about your role, tools, or data..." 
                                    className="w-full bg-background border border-border focus:border-accent/50 rounded-2xl py-3.5 pl-5 pr-14 text-sm focus:outline-none transition-all text-text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-accent hover:bg-accent/10 disabled:opacity-30 rounded-xl transition-all"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-[9px] text-text/20 text-center mt-3 uppercase tracking-tighter">Powered by UMS Intelligence Engine</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-text shadow-2xl shadow-accent/20 hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isOpen ? <X className="relative z-10" /> : <Sparkles className="relative z-10" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-background animate-pulse"></span>
                )}
            </button>
        </div>
    );
};

export default AIChatbot;


