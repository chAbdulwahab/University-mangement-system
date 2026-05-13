import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck,
  Landmark,
  BookOpen, 
  Calendar, 
  CreditCard, 
  LogOut, 
  Award,
  Bell,
  LayoutDashboard,
  BarChart3,
  Search,
  Briefcase,
  Sun,
  Moon,
  Menu,
  X
} from 'lucide-react';
import AIChatbot from '../components/AIChatbot';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const onLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    // Close sidebar on route change (mobile)
    setIsSidebarOpen(false);
  }, [location.pathname]);

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-text/40 font-medium animate-pulse uppercase tracking-widest text-xs">Initializing System...</p>
      </div>
    );
  }

  const getPageTitle = () => {
    const item = navItems.find(item => item.path === location.pathname);
    return item ? item.label : 'Dashboard';
  };

  const navItems = user?.role === 'Admin' ? [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { label: 'Students', icon: Users, path: '/students' },
    { label: 'Faculty', icon: UserCheck, path: '/teachers' },
    { label: 'Departments', icon: Landmark, path: '/departments' },
    { label: 'Courses', icon: BookOpen, path: '/courses' },
    { label: 'Finance', icon: CreditCard, path: '/finance' },
  ] : user?.role === 'Teacher' ? [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Attendance', icon: Calendar, path: '/attendance' },
    { label: 'Marks', icon: Award, path: '/marks' },
    { label: 'Assignments', icon: Briefcase, path: '/assignments' },
    { label: 'Materials', icon: BookOpen, path: '/materials' },
    { label: 'Profile', icon: UserCheck, path: '/teacher-profile' },
  ] : [
    { label: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Enroll', icon: BookOpen, path: '/enroll' },
    { label: 'Attendance', icon: Calendar, path: '/attendance-view' },
    { label: 'Results', icon: Award, path: '/results' },
    { label: 'Fees', icon: CreditCard, path: '/fees' },
    { label: 'Assignments', icon: Briefcase, path: '/student-assignments' },
    { label: 'Profile', icon: UserCheck, path: '/student-profile' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-border flex items-center justify-between px-6 z-[60] print:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="font-bold text-lg text-text">U</span>
          </div>
          <span className="font-bold tracking-tight text-text">UMS PRO</span>
        </Link>
        <button 
          onClick={toggleSidebar}
          className="p-2 text-text hover:bg-text/5 rounded-lg transition-all"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay - Mobile Only */}
      {isSidebarOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
        />
      )}

      {/* Sidebar - Hidden on Print */}
      <aside className={`
        fixed inset-y-0 left-0 z-[80] w-64 bg-sidebar border-r border-border flex flex-col 
        print:hidden transition-all duration-300 lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <Link to="/" className="hidden lg:flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <span className="font-bold text-xl text-text">U</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-text transition-colors">UMS PRO</span>
          </Link>
 
          <nav className="space-y-1 lg:mt-0 mt-16">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  location.pathname === item.path 
                  ? 'bg-accent/10 text-accent' 
                  : 'text-text/60 hover:bg-text/5 hover:text-text'
                }`}
              >
                <item.icon className="w-5 h-5" /> {item.label}
              </Link>
            ))}
          </nav>
        </div>
 
        <div className="mt-auto p-6 space-y-2 border-t border-border">
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 text-text/60 hover:bg-text/5 rounded-xl transition-all"
          >
            {theme === 'dark' ? (
              <><Sun className="w-5 h-5" /> Light Mode</>
            ) : (
              <><Moon className="w-5 h-5" /> Dark Mode</>
            )}
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-10 pt-20 lg:pt-8 print:p-0 print:overflow-visible transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Top Navbar - Desktop Only Header */}
          <header className="hidden lg:flex items-center justify-between mb-10 pb-6 border-b border-border/50">
            <div>
              <h1 className="text-3xl font-black text-text tracking-tight text-gradient">{getPageTitle()}</h1>
              <p className="text-xs font-bold text-text/30 uppercase tracking-[0.3em] mt-1">University Management System • v1.0</p>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text/30 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  placeholder="Quick search..." 
                  className="bg-card/50 border border-border/50 rounded-2xl py-2.5 pl-11 pr-6 text-sm w-64 focus:outline-none focus:border-accent/50 focus:w-80 transition-all text-text"
                />
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-text/40 hover:text-text hover:bg-card rounded-xl transition-all relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background"></span>
                </button>
                <div className="h-8 w-[1px] bg-border mx-2"></div>
                <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                  <div className="text-right">
                    <p className="text-sm font-black text-text group-hover:text-accent transition-colors">{user?.name}</p>
                    <p className="text-[10px] font-bold text-text/30 uppercase tracking-widest">{user?.role}</p>
                  </div>
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-text font-black shadow-lg shadow-accent/10">
                    {user?.name?.[0]}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <Outlet />
        </div>
      </main>

      {/* Chatbot - Hidden on Print */}
      <div className="print:hidden fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-[100]">
        <AIChatbot />
      </div>
    </div>
  );
};

export default Dashboard;


