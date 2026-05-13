import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="max-w-6xl w-full pt-32 pb-20 px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl lg:text-7xl font-black text-text mb-4 tracking-tighter"
          >
            Get in <span className="text-gradient">Touch</span>
          </motion.h1>
          <p className="text-lg text-text/40 font-medium">We're here to help you manage your institution smoothly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {[
              { icon: Mail, label: 'Email Support', val: 'support@umspro.edu', color: 'bg-accent/10 text-accent' },
              { icon: Phone, label: 'Helpline', val: '+1 (555) 123-4567', color: 'bg-primary/10 text-primary' },
              { icon: MapPin, label: 'Campus Office', val: '123 Education Plaza, Tech City, ST 54321', color: 'bg-highlight/10 text-highlight' }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ x: 5 }}
                className="glass-card flex items-start gap-4 border-white/5"
              >
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-text/30 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-text/80">{item.val}</p>
                </div>
              </motion.div>
            ))}

            <div className="glass-card bg-accent/5 border-accent/20">
               <div className="flex items-center gap-3 mb-4">
                 <MessageSquare className="w-5 h-5 text-accent" />
                 <h4 className="font-bold text-text">Live Support</h4>
               </div>
               <p className="text-xs text-text/60 leading-relaxed mb-6">Our dedicated support team is available 24/7 for administrative emergencies.</p>
               <button className="w-full btn-accent !py-3 !text-sm">Start Live Chat</button>
            </div>
          </div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 glass-card border-white/10"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Your Name</label>
                  <input type="text" className="input-field !bg-white/5 focus:!bg-white/10 !py-3" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <input type="email" className="input-field !bg-white/5 focus:!bg-white/10 !py-3" placeholder="john@example.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Subject</label>
                <input type="text" className="input-field !bg-white/5 focus:!bg-white/10 !py-3" placeholder="How can we help?" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Detailed Message</label>
                <textarea rows="5" className="input-field !bg-white/5 focus:!bg-white/10 !py-3" placeholder="Type your message here..."></textarea>
              </div>

              <button type="submit" className="btn-primary !py-4 !px-8 flex items-center gap-2 group">
                Send Message <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </main>

      <footer className="mt-auto py-10 text-center">
         <Link to="/" className="text-xs font-black text-text/20 hover:text-accent uppercase tracking-[0.4em] transition-colors">Back to UMS PRO Home</Link>
      </footer>
    </div>
  );
};

export default Contact;
