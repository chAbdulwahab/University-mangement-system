import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-text">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

      <main className="max-w-4xl mx-auto pt-24 pb-20 px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-text/40 hover:text-accent transition-colors mb-12 font-bold uppercase tracking-widest text-xs">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card !p-12 border-white/5"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-accent">
               <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Privacy Policy</h1>
              <p className="text-text/40 text-sm font-medium">Last updated: May 13, 2024</p>
            </div>
          </div>

          <div className="space-y-8 text-text/60 leading-relaxed">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                <Eye className="w-5 h-5 text-accent" /> 1. Information We Collect
              </h2>
              <p>
                We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services or otherwise when you contact us.
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Personal Data (Name, Email, Roll Number)</li>
                <li>Academic Records (Grades, Attendance, Course Enrollment)</li>
                <li>Device Information (IP Address, Browser Type)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                <Lock className="w-5 h-5 text-accent" /> 2. How We Use Your Information
              </h2>
              <p>
                We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" /> 3. Data Security
              </h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-sm text-text/40 italic">
              If you have any questions or comments about this policy, you may contact our Data Protection Officer at <span className="text-accent font-bold">privacy@umspro.edu</span>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
