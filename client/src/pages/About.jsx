import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Users, Globe, Target, Heart } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-accent/10 to-transparent pointer-events-none" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-card !rounded-full !py-3 !px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg text-text">U</span>
            </div>
            <span className="font-bold tracking-tight text-text">UMS PRO</span>
          </Link>
          <div className="flex gap-4">
             <Link to="/login" className="text-sm font-bold text-text/60 hover:text-accent transition-colors">Sign In</Link>
             <Link to="/" className="text-sm font-bold text-text/60 hover:text-accent transition-colors">Back Home</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto pt-32 pb-20 px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-widest mb-6">Our Legacy</span>
          <h1 className="text-5xl lg:text-7xl font-black text-text mb-6 tracking-tighter">Empowering the <span className="text-gradient">Next Generation</span> of Leaders.</h1>
          <p className="text-lg text-text/40 leading-relaxed max-w-3xl mx-auto">
            UMS Pro is more than just a software; it is a vision to revolutionize how educational institutions operate, making them more efficient, transparent, and student-centric.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <motion.div whileHover={{ y: -5 }} className="glass-card">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-4">Our Mission</h3>
            <p className="text-text/40 leading-relaxed">
              To provide a unified digital ecosystem that streamlines administrative overhead, allowing faculty to focus on teaching and students to focus on learning.
            </p>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} className="glass-card">
            <div className="w-12 h-12 bg-highlight/20 rounded-xl flex items-center justify-center text-highlight mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-4">Our Core Values</h3>
            <p className="text-text/40 leading-relaxed">
              Innovation, Integrity, and Inclusivity. We believe technology should be accessible to all and secure by design.
            </p>
          </motion.div>
        </div>

        <section className="space-y-12">
          <h2 className="text-3xl font-black text-text text-center">Global Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
             {[
               { icon: Globe, label: 'Countries', value: '12+' },
               { icon: Users, label: 'Institutions', value: '50+' },
               { icon: Award, label: 'Awards', value: '5+' },
               { icon: GraduationCap, label: 'Graduates', value: '100k+' }
             ].map((item, idx) => (
               <div key={idx} className="p-6">
                 <item.icon className="w-8 h-8 text-accent mx-auto mb-4" />
                 <p className="text-3xl font-black text-text">{item.value}</p>
                 <p className="text-xs font-bold text-text/30 uppercase tracking-widest mt-1">{item.label}</p>
               </div>
             ))}
          </div>
        </section>

        <div className="mt-20 text-center">
           <Link to="/register" className="btn-accent !rounded-full !py-4 !px-10 text-lg font-black shadow-2xl shadow-accent/20">
              Be Part of Our Future
           </Link>
        </div>
      </main>
    </div>
  );
};

export default About;
