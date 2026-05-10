const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
    const { courseName, courseCode, creditHours, teacherId, semester, department, schedule, location } = req.body;

    const courseExists = await Course.findOne({ courseCode });
    if (courseExists) {
        return res.status(400).json({ message: 'Course code already exists' });
    }

    const course = await Course.create({
        courseName,
        courseCode,
        creditHours,
        teacher: teacherId,
        semester,
        department,
        schedule,
        location
    });

    if (teacherId) {
        await User.findByIdAndUpdate(teacherId, { 
            $addToSet: { assignedCourses: course._id } 
        });
    }

    res.status(201).json(course);
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/enroll
// @access  Private
const enrollStudent = async (req, res) => {
    const { studentId, courseId, semester } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const alreadyEnrolled = await Enrollment.findOne({ student: studentId, course: courseId, semester });
    if (alreadyEnrolled) return res.status(400).json({ message: 'Already enrolled in this course for this semester' });

    const enrollment = await Enrollment.create({
        student: studentId,
        course: courseId,
        semester
    });

    // Add to student's courses array
    await User.findByIdAndUpdate(studentId, { $push: { courses: courseId } });
    // Add to course's students array
    await Course.findByIdAndUpdate(courseId, { $push: { students: studentId } });

    res.status(201).json(enrollment);
};

// @desc    Update a course (Admin only)
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
    try {
        const { courseName, courseCode, creditHours, teacherId, semester, department, schedule, location } = req.body;
        const course = await Course.findById(req.params.id);

        if (course) {
            course.courseName = courseName || course.courseName;
            course.courseCode = courseCode || course.courseCode;
            course.creditHours = creditHours || course.creditHours;
            course.teacher = teacherId || course.teacher;
            course.semester = semester || course.semester;
            course.department = department || course.department;
            course.schedule = schedule || course.schedule;
            course.location = location || course.location;

            const updatedCourse = await course.save();
            
            if (teacherId) {
                await User.findByIdAndUpdate(teacherId, { 
                    $addToSet: { assignedCourses: course._id } 
                });
            }

            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to update course' });
    }
};

// @desc    Get courses assigned to the logged-in teacher
// @route   GET /api/courses/my-courses
// @access  Private/Teacher
const getTeacherCourses = async (req, res) => {
    try {
        const teacher = await User.findById(req.user._id);
        
        const courses = await Course.find({ 
            $or: [
                { teacher: req.user._id },
                { _id: { $in: teacher.assignedCourses || [] } },
                { teacherName: req.user.name } // Fallback for name-based assignment
            ]
        }).populate('students', 'name');

        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch your courses' });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
    const courses = await Course.find({}).populate('teacher', 'name email');
    res.json(courses);
};

// @desc    Get students enrolled in a specific course
// @route   GET /api/courses/:id/students
// @access  Private/Teacher/Admin
const getEnrolledStudents = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('students', 'name rollNumber email');
        if (!course) return res.status(404).json({ message: 'Course not found' });

        res.json(course.students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch enrolled students' });
    }
};

module.exports = {
    createCourse,
    enrollStudent,
    updateCourse,
    getTeacherCourses,
    getEnrolledStudents,
    getCourses
};
