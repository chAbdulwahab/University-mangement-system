import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  BarChart3, 
  Users,
  Globe,
  Bot
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-card !rounded-full !py-3 !px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg text-text">U</span>
            </div>
            <span className="font-bold tracking-tight text-text">UMS PRO</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-text/60 hover:text-accent transition-colors">Features</a>
            <Link to="/about" className="text-sm font-medium text-text/60 hover:text-accent transition-colors">About</Link>
            <Link to="/contact" className="text-sm font-medium text-text/60 hover:text-accent transition-colors">Support</Link>
            <Link to="/login" className="text-sm font-medium text-text/60 hover:text-accent transition-colors">Sign In</Link>
          </div>
          <Link to="/register" className="btn-accent !rounded-full !py-2 !px-6 text-sm">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-6">
                  <Zap className="w-3 h-3" /> The Future of Education
                </span>
                <h1 className="text-5xl lg:text-7xl font-black text-text leading-[1.1] mb-8">
                  Elevate Your <span className="text-gradient">University</span> Experience.
                </h1>
                <p className="text-lg text-text/60 mb-10 max-w-2xl">
                  A comprehensive, AI-driven management system designed for modern campuses. Streamline administration, empower faculty, and inspire students.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link to="/register" className="btn-primary flex items-center gap-2 !py-4 !px-8 text-lg w-full sm:w-auto">
                    Start Your Journey <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="px-8 py-4 text-text font-semibold hover:text-accent transition-colors">
                    Log in to Portal
                  </Link>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-border/50">
                <img 
                  src="/university_hero_1778709428307.png" 
                  alt="University Campus" 
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              {/* Floating Cards */}
              <div className="absolute -top-6 -right-6 glass-card !p-4 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-highlight/20 rounded-lg flex items-center justify-center text-highlight">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-text/40 font-bold uppercase">Analytics</p>
                    <p className="text-sm font-bold text-text">98% Success Rate</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card !p-4 animate-bounce-slow delay-1000">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-text/40 font-bold uppercase">AI Assistant</p>
                    <p className="text-sm font-bold text-text">Always Online</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-text mb-4">Powerful Features</h2>
            <p className="text-text/60 max-w-xl mx-auto">Everything you need to manage your institution efficiently in one unified platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: 'Secure Access', 
                desc: 'Role-based access control for students, faculty, and administrators.',
                color: 'bg-blue-500/10 text-blue-500'
              },
              { 
                icon: Bot, 
                title: 'AI Insights', 
                desc: 'Integrated AI chatbot to assist with queries and administrative tasks.',
                color: 'bg-accent/10 text-accent'
              },
              { 
                icon: BarChart3, 
                title: 'Live Analytics', 
                desc: 'Real-time dashboards for fees, attendance, and academic performance.',
                color: 'bg-highlight/10 text-highlight'
              },
              { 
                icon: Globe, 
                title: 'Cloud First', 
                desc: 'Access your university from anywhere in the world on any device.',
                color: 'bg-purple-500/10 text-purple-500'
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="glass-card flex flex-col items-center text-center group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
                <p className="text-sm text-text/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-accent/5 border-y border-accent/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around gap-12 text-center">
          {[
            { label: 'Active Students', value: '15k+' },
            { label: 'Course Modules', value: '450+' },
            { label: 'Faculty Members', value: '800+' },
            { label: 'Admin Modules', value: '25+' }
          ].map((stat, idx) => (
            <div key={idx}>
              <p className="text-4xl lg:text-5xl font-black text-accent mb-2">{stat.value}</p>
              <p className="text-xs font-bold text-text/40 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border mt-20 relative overflow-hidden bg-sidebar/30">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 relative z-10">
          <div className="md:col-span-4">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                <span className="font-bold text-xl text-text">U</span>
              </div>
              <span className="text-2xl font-black tracking-tighter text-text">UMS PRO</span>
            </Link>
            <p className="text-sm text-text/40 leading-relaxed max-w-xs mb-8">
              Innovating higher education management with cutting-edge AI and cloud technologies. Built for the modern campus.
            </p>
            <div className="flex gap-4">
               {['Twitter', 'LinkedIn', 'Facebook', 'Instagram'].map(social => (
                 <a key={social} href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-text/40 hover:text-accent hover:border-accent/20 hover:bg-accent/5 transition-all">
                   <Globe className="w-5 h-5" />
                 </a>
               ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-xs font-black text-text uppercase tracking-widest mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm text-text/40 font-medium">
              <li><Link to="/" className="hover:text-accent transition-colors">Home Page</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">Our Story</Link></li>
              <li><a href="#features" className="hover:text-accent transition-colors">Platform Features</a></li>
              <li><Link to="/login" className="hover:text-accent transition-colors">Access Portal</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-xs font-black text-text uppercase tracking-widest mb-8">Legal</h4>
            <ul className="space-y-4 text-sm text-text/40 font-medium">
              <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link to="/privacy" className="hover:text-accent transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">Compliance</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Security</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-black text-text uppercase tracking-widest mb-8">Newsletter</h4>
            <p className="text-xs text-text/40 mb-6">Subscribe to receive institutional updates and platform news.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="university-email@edu.com" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-accent/50 transition-all text-text"
              />
              <button className="absolute right-2 top-1.5 bg-accent hover:bg-accent/80 text-white p-1.5 rounded-lg transition-all">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-text/20 uppercase tracking-[0.4em]">© 2024 UMS PRO SYSTEM. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-[10px] font-bold text-text/20 uppercase tracking-widest">
             <Link to="/contact" className="hover:text-text transition-colors">Support Center</Link>
             <Link to="/about" className="hover:text-text transition-colors">System Status</Link>
             <Link to="/privacy" className="hover:text-text transition-colors">Data Protection</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
