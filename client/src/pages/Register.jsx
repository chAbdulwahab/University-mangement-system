import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, BookOpen, ArrowRight } from 'lucide-react';
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
    <div className="flex items-center justify-center min-h-screen p-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-text">Create Account</h1>
          <p className="text-text/60">Join the University Management System</p>
        </div>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text/80 flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="input-field"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text/80 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="input-field"
              placeholder="john@university.edu"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text/80 flex items-center gap-2">
              <Lock className="w-4 h-4" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text/80 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Department
            </label>
            <input
              type="text"
              name="department"
              value={department}
              onChange={onChange}
              className="input-field"
              placeholder="Computer Science"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text/80 flex items-center gap-2">
               Role
            </label>
            <select 
              name="role" 
              value={role} 
              onChange={onChange}
              className="input-field bg-card text-text"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>

          {role === 'Student' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-text/80">Roll Number</label>
              <input
                type="text"
                name="rollNumber"
                value={rollNumber}
                onChange={onChange}
                className="input-field"
                placeholder="CS101-2024"
                required={role === 'Student'}
              />
            </div>
          )}

          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Register Account <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-text/40">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;


