const User = require('../models/User');
const Course = require('../models/Course');
const Department = require('../models/Department');
const Fee = require('../models/Fee');
const Result = require('../models/Result');

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = async (req, res) => {
    const students = await User.find({ role: 'Student' }).select('-password');
    res.json(students);
};

// @desc    Get all teachers
// @route   GET /api/admin/teachers
// @access  Private/Admin
const getTeachers = async (req, res) => {
    const teachers = await User.find({ role: 'Teacher' }).select('-password');
    res.json(teachers);
};

// @desc    Add a new student/teacher (Admin only)
// @route   POST /api/admin/users
// @access  Private/Admin
const addUser = async (req, res) => {
    try {
        const { name, email, password, role, department, rollNumber, semester } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            department,
            rollNumber,
            semester: semester || 1
        });

        if (user) {
            res.status(201).json({ message: 'User created successfully', user: { _id: user._id, name: user.name, role: user.role } });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to add user' });
    }
};

// @desc    Update user details
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserDetails = async (req, res) => {
    try {
        console.log('Update Request for ID:', req.params.id);
        console.log('Update Body:', req.body);
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email is being changed to one that already exists
        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use by another user' });
            }
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.department = req.body.department || user.department;
        user.rollNumber = req.body.rollNumber || user.rollNumber;
        
        if (req.body.semester !== undefined && req.body.semester !== '') {
            user.semester = Number(req.body.semester);
        }
        
        if (req.body.password && req.body.password.trim() !== '') {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        console.error('Update User Detailed Error:', error);
        res.status(500).json({ 
            message: 'Server Error: Failed to update user', 
            error: error.code === 11000 ? 'Duplicate field error (Email/Roll Number already exists)' : error.message 
        });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Create a Department
// @route   POST /api/admin/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
    try {
        const { name, code } = req.body;
        
        const nameExists = await Department.findOne({ name });
        if (nameExists) {
            return res.status(400).json({ message: 'Department name already exists' });
        }

        const codeExists = await Department.findOne({ code });
        if (codeExists) {
            return res.status(400).json({ message: 'Department code already exists' });
        }

        const department = await Department.create({ name, code });
        res.status(201).json(department);
    } catch (error) {
        console.error('Department Creation Error:', error);
        res.status(500).json({ 
            message: 'Server Error: Failed to create department',
            error: error.message 
        });
    }
};

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({});
        
        const departmentsWithStats = await Promise.all(departments.map(async (dept) => {
            const facultyCount = await User.countDocuments({ role: 'Teacher', department: dept.name });
            const courseCount = await Course.countDocuments({ department: dept.name });
            
            return {
                ...dept._doc,
                facultyCount,
                courseCount
            };
        }));

        res.json(departmentsWithStats);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch departments' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const studentCount = await User.countDocuments({ role: 'Student' });
        const teacherCount = await User.countDocuments({ role: 'Teacher' });
        const courseCount = await Course.countDocuments();
        const departmentCount = await Department.countDocuments();

        res.json({
            students: studentCount,
            teachers: teacherCount,
            courses: courseCount,
            departments: departmentCount,
            pendingFees: 12400, // Placeholder
            events: 3
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get detailed analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        // 1. Monthly Revenue & Enrollment
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 0; i < 6; i++) {
            const currentMonth = new Date(sixMonthsAgo);
            currentMonth.setMonth(currentMonth.getMonth() + i);
            const monthName = months[currentMonth.getMonth()];
            
            const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

            const revenue = await Fee.aggregate([
                { $match: { status: 'Paid', paymentDate: { $gte: start, $lte: end } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            const studentsJoined = await User.countDocuments({ 
                role: 'Student', 
                createdAt: { $gte: start, $lte: end } 
            });

            monthlyData.push({
                name: monthName,
                revenue: revenue.length > 0 ? revenue[0].total : 0,
                students: studentsJoined
            });
        }

        // 2. Department Performance (Efficiency Ranking)
        const departments = await Department.find({});
        const deptPerformance = await Promise.all(departments.map(async (dept) => {
            const courses = await Course.find({ department: dept.name });
            const courseIds = courses.map(c => c._id);
            
            const results = await Result.aggregate([
                { $match: { course: { $in: courseIds } } },
                { $group: { _id: null, avgMarks: { $avg: '$marks' } } }
            ]);

            return {
                name: dept.name,
                score: results.length > 0 ? Math.round(results[0].avgMarks) : 0,
                color: dept.name === 'Computer Science' ? 'bg-teal-500' : dept.name === 'Business Administration' ? 'bg-blue-500' : 'bg-amber-500'
            };
        }));

        // 3. Quick Stats
        const totalRevenue = await Fee.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const facultyCount = await User.countDocuments({ role: 'Teacher' });
        const researchCount = await Course.countDocuments(); // Placeholder for research papers

        const stats = [
            { label: 'Annual Revenue', value: `PKR ${(totalRevenue[0]?.total / 1000 || 0).toFixed(1)}k`, change: '+12.5%', icon: 'DollarSign', color: 'text-teal-500' },
            { label: 'Retention Rate', value: '98.2%', change: '+2.1%', icon: 'TrendingUp', color: 'text-accent' },
            { label: 'Active Faculty', value: facultyCount.toString(), change: '+4', icon: 'Users', color: 'text-primary' },
            { label: 'Research Papers', value: researchCount.toString(), change: '+8', icon: 'BookOpen', color: 'text-amber-500' },
        ];

        res.json({
            monthlyData,
            deptPerformance: deptPerformance.sort((a, b) => b.score - a.score),
            stats
        });
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getStudents,
    getTeachers,
    addUser,
    updateUserDetails,
    deleteUser,
    createDepartment,
    getDepartments,
    getDashboardStats,
    getAnalytics
};
