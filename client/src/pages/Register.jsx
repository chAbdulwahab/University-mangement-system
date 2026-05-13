import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, BookOpen, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Student',
    department: '',
    rollNumber: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password, role, department, rollNumber } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      if (res.data) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-12 relative overflow-hidden bg-background">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_50%)]" />
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.1),transparent_50%)]" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card w-full max-w-3xl relative z-10 border-white/10"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="w-16 h-16 bg-gradient-to-tr from-accent to-highlight rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-accent/20"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-text tracking-tight">Join the Elite</h1>
          <p className="text-text/40 font-medium uppercase tracking-[0.3em] text-xs mt-2 text-center">Create your university account</p>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <User className="w-3 h-3" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="input-field !bg-white/5 focus:!bg-white/10 !py-3 !rounded-xl"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <Mail className="w-3 h-3" /> Institutional Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="input-field !bg-white/5 focus:!bg-white/10 !py-3 !rounded-xl"
              placeholder="john@university.edu"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <Lock className="w-3 h-3" /> Security Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={onChange}
                className="input-field !bg-white/5 focus:!bg-white/10 !py-3 !rounded-xl pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text/20 hover:text-accent transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
              <BookOpen className="w-3 h-3" /> Department
            </label>
            <input
              type="text"
              name="department"
              value={department}
              onChange={onChange}
              className="input-field !bg-white/5 focus:!bg-white/10 !py-3 !rounded-xl"
              placeholder="Computer Science"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Account Role</label>
            <select 
              name="role" 
              value={role} 
              onChange={onChange}
              className="input-field !bg-white/5 focus:!bg-white/10 !py-3 !rounded-xl text-text"
            >
              <option value="Student">Student (Default)</option>
              <option value="Teacher">Faculty Member</option>
            </select>
          </div>

          {role === 'Student' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-text/40 uppercase tracking-[0.2em] ml-1">Assigned Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                value={rollNumber}
                onChange={onChange}
                className="input-field !bg-white/5 focus:!bg-white/10 !py-3 !rounded-xl"
                placeholder="CS101-2024"
                required={role === 'Student'}
              />
            </div>
          )}

          <div className="md:col-span-2 pt-6">
            <button
              type="submit"
              className="btn-accent w-full !py-4 !rounded-xl flex items-center justify-center gap-3 text-lg font-black group shadow-xl shadow-accent/20 hover:shadow-accent/40 transition-all"
            >
              Finalize Registration <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-12 text-center pt-8 border-t border-white/5">
          <p className="text-sm text-text/40 font-medium">
            Already registered?{' '}
            <Link to="/login" className="text-accent hover:text-white underline decoration-accent/30 hover:decoration-white font-bold transition-all">
              Sign into your portal
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;


