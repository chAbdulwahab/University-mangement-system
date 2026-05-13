import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, reset } from '../redux/authSlice';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 relative overflow-hidden bg-background">
      {/* Dynamic Background Orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md relative z-10 border-white/10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            initial={{ rotate: -10, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-accent/20"
          >
            <GraduationCap className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-text tracking-tighter mb-2">Welcome Back</h1>
          <p className="text-text/40 text-sm font-medium uppercase tracking-[0.2em]">Secure Portal Login</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text/60 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="input-field !bg-white/5 focus:!bg-white/10 !py-3 !rounded-xl"
              placeholder="name@university.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text/60 uppercase tracking-widest flex items-center gap-2 ml-1">
              <Lock className="w-3.5 h-3.5" /> Password
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text/30 hover:text-accent transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-border bg-white/5 text-accent focus:ring-accent" />
              <span className="text-xs text-text/40 group-hover:text-text transition-colors">Remember me</span>
            </label>
            <Link to="#" className="text-xs text-accent hover:underline font-bold">Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full !py-4 !rounded-xl flex items-center justify-center gap-3 text-lg font-bold group shadow-2xl shadow-primary/20 hover:shadow-primary/40"
          >
            {isLoading ? 'Processing...' : 'Sign Into Portal'}
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-10 text-center space-y-4">
          <p className="text-sm text-text/40">
            New to UMS Pro?{' '}
            <Link to="/register" className="text-accent hover:text-white underline decoration-accent/30 hover:decoration-white font-bold transition-all">
              Create an account
            </Link>
          </p>
          <div className="pt-6 border-t border-white/5 flex justify-center gap-4">
             <Link to="/" className="text-[10px] font-bold text-text/20 hover:text-text/60 uppercase tracking-widest transition-colors">Home</Link>
             <Link to="/about" className="text-[10px] font-bold text-text/20 hover:text-text/60 uppercase tracking-widest transition-colors">About</Link>
             <Link to="/contact" className="text-[10px] font-bold text-text/20 hover:text-text/60 uppercase tracking-widest transition-colors">Support</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;


