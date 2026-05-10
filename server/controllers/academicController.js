const Attendance = require('../models/Attendance');
const Result = require('../models/Result');
const User = require('../models/User');
const Course = require('../models/Course');

// @desc    Mark attendance for a list of students
// @route   POST /api/academic/attendance
// @access  Private/Teacher
const markAttendance = async (req, res) => {
    const { courseId, attendanceData } = req.body; // attendanceData: [{studentId, status}]

    try {
        const records = attendanceData.map(data => ({
            student: data.studentId,
            course: courseId,
            status: data.status,
            markedBy: req.user._id,
            date: new Date().setHours(0,0,0,0) // Normalize to start of day
        }));

        await Attendance.insertMany(records, { ordered: false });
        res.status(201).json({ message: 'Attendance marked successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to mark attendance (some records may already exist)' });
    }
};

// @desc    Upload marks and calculate GPA points
// @route   POST /api/academic/results
// @access  Private/Teacher
const uploadResult = async (req, res) => {
    const { studentId, courseId, marks, semester } = req.body;

    // Simplified grade point logic
    let grade, gp;
    if (marks >= 85) { grade = 'A'; gp = 4.0; }
    else if (marks >= 75) { grade = 'B'; gp = 3.0; }
    else if (marks >= 65) { grade = 'C'; gp = 2.0; }
    else if (marks >= 50) { grade = 'D'; gp = 1.0; }
    else { grade = 'F'; gp = 0.0; }

    const result = await Result.create({
        student: studentId,
        course: courseId,
        marks,
        grade,
        gradePoints: gp,
        semester
    });

    res.status(201).json(result);
};

// @desc    Get student GPA for a semester
// @route   GET /api/academic/gpa/:studentId/:semester
// @access  Private
const calculateGPA = async (req, res) => {
    const { studentId, semester } = req.params;
    
    const results = await Result.find({ student: studentId, semester }).populate('course');
    
    let totalPoints = 0;
    let totalCredits = 0;

    results.forEach(res => {
        if (res.course) {
            totalPoints += (res.gradePoints * res.course.creditHours);
            totalCredits += res.course.creditHours;
        }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;

    res.json({ 
        gpa, 
        semester, 
        totalCredits, 
        courses: results.length,
        results: results.map(r => ({
            courseName: r.course?.courseName,
            courseCode: r.course?.courseCode,
            marks: r.marks,
            grade: r.grade,
            gp: r.gradePoints
        }))
    });
};

const Assignment = require('../models/Assignment');
const Material = require('../models/Material');

// @desc    Get assignments for the courses a student is enrolled in
// @route   GET /api/academic/assignments
// @access  Private
const getAssignments = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || user.role !== 'Student') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Find assignments for courses the student is in
        const assignments = await Assignment.find({
            course: { $in: user.courses }
        }).populate('course', 'courseName courseCode').sort({ dueDate: 1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch assignments' });
    }
};

// @desc    Get attendance for the logged-in student
// @route   GET /api/academic/attendance/my
// @access  Private
const getStudentAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find({ student: req.user._id })
            .populate('course', 'courseName courseCode')
            .sort({ date: -1 });

        const statsMap = {};
        attendance.forEach(record => {
            if (!record.course) return;
            const courseId = record.course._id.toString();
            if (!statsMap[courseId]) {
                statsMap[courseId] = {
                    subject: record.course.courseName,
                    present: 0,
                    absent: 0,
                    total: 0
                };
            }
            statsMap[courseId].total++;
            if (record.status === 'Present') {
                statsMap[courseId].present++;
            } else {
                statsMap[courseId].absent++;
            }
        });

        const courseStats = Object.values(statsMap).map(s => ({
            ...s,
            percentage: s.total > 0 ? Math.round((s.present / s.total) * 100) : 0
        }));

        res.json({ history: attendance, stats: courseStats });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch attendance' });
    }
};

// @desc    Get upcoming lectures for enrolled courses
// @route   GET /api/academic/lectures/upcoming
// @access  Private
const getUpcomingLectures = async (req, res) => {
    try {
        const student = await User.findById(req.user._id).populate({
            path: 'courses',
            populate: { path: 'teacher', select: 'name' }
        });
        
        if (!student || !student.courses) {
            return res.json([]);
        }

        const lectures = student.courses.map(course => ({
            _id: course._id,
            courseName: course.courseName,
            courseCode: course.courseCode,
            teacher: course.teacher?.name || 'TBD',
            schedule: course.schedule || 'TBD',
            location: course.location || 'Room TBD'
        }));

        res.json(lectures);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch upcoming lectures' });
    }
};

// @desc    Get aggregate stats for a teacher's dashboard
// @route   GET /api/academic/teacher/stats
// @access  Private/Teacher
const getTeacherStats = async (req, res) => {
    try {
        // Find teacher and their assigned courses
        const teacher = await User.findById(req.user._id);
        
        // Find all courses where this teacher is assigned (check both directions)
        const courses = await Course.find({ 
            $or: [
                { teacher: req.user._id },
                { _id: { $in: teacher.assignedCourses || [] } },
                { teacherName: req.user.name }
            ]
        });

        const courseIds = courses.map(c => c._id);
        const attendanceRecords = await Attendance.find({ course: { $in: courseIds } });
        
        let totalPresent = 0;
        let totalCount = 0;

        attendanceRecords.forEach(record => {
            if (record.status === 'Present') totalPresent++;
            totalCount++;
        });

        const avgAttendance = totalCount > 0 ? (totalPresent / totalCount) * 100 : 0;

        res.json({
            avgAttendance: Math.round(avgAttendance) + '%',
            pendingAssignments: 0 
        });
    } catch (error) {
        console.error('Teacher Stats Error:', error);
        res.status(500).json({ message: 'Server Error: Failed to fetch teacher stats' });
    }
};

// @desc    Create a new assignment
// @route   POST /api/academic/assignments
// @access  Private/Teacher
const createAssignment = async (req, res) => {
    const { title, description, courseId, dueDate } = req.body;

    try {
        // Verify the teacher is assigned to this course
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        if (course.teacher?.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You can only create assignments for your assigned courses' });
        }

        const assignment = new Assignment({
            title,
            description,
            course: courseId,
            teacher: req.user._id,
            dueDate
        });

        const savedAssignment = await assignment.save();
        res.status(201).json(savedAssignment);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to create assignment' });
    }
};

// @desc    Get assignments for a teacher's courses
// @route   GET /api/academic/assignments/teacher
// @access  Private/Teacher
const getTeacherAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ teacher: req.user._id })
            .populate('course', 'courseName courseCode')
            .populate('submissions.student', 'name rollNumber');
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch assignments' });
    }
};

// @desc    Submit an assignment
// @route   POST /api/academic/assignments/:id/submit
// @access  Private/Student
const submitAssignment = async (req, res) => {
    const { fileUrl } = req.body;

    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        // Check if already submitted
        const alreadySubmitted = assignment.submissions.some(s => s.student.toString() === req.user._id.toString());
        if (alreadySubmitted) return res.status(400).json({ message: 'Already submitted' });

        assignment.submissions.push({
            student: req.user._id,
            fileUrl: fileUrl || 'https://link-to-submission.com', // Placeholder for now
            submittedAt: new Date()
        });

        await assignment.save();
        res.status(200).json({ message: 'Assignment submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to submit assignment' });
    }
};

// @desc    Toggle checked status for an assignment submission
// @route   PUT /api/academic/assignments/:id/check/:studentId
// @access  Private/Teacher
const toggleSubmissionCheck = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        const submission = assignment.submissions.find(s => s.student.toString() === req.params.studentId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.isChecked = !submission.isChecked;
        await assignment.save();

        res.json({ message: `Submission marked as ${submission.isChecked ? 'Checked' : 'Unchecked'}` });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to update status' });
    }
};

// @desc    Grade an assignment submission
// @route   PUT /api/academic/assignments/:id/grade/:studentId
// @access  Private/Teacher
const gradeAssignment = async (req, res) => {
    const { marks } = req.body;

    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        const submission = assignment.submissions.find(s => s.student.toString() === req.params.studentId);
        if (!submission) return res.status(404).json({ message: 'Submission not found' });

        submission.marks = Number(marks);
        submission.isChecked = true;
        await assignment.save();

        // Automatically update the main Result for this student/course
        // We'll sum all assignment marks for this course
        const allAssignments = await Assignment.find({ 
            course: assignment.course, 
            'submissions.student': req.params.studentId 
        });

        let totalMarks = 0;
        allAssignments.forEach(a => {
            const sub = a.submissions.find(s => s.student.toString() === req.params.studentId);
            if (sub) totalMarks += sub.marks;
        });

        // Update or Create Result
        let result = await Result.findOne({ student: req.params.studentId, course: assignment.course });
        
        // Grade logic (can be made more complex)
        let grade, gp;
        if (totalMarks >= 85) { grade = 'A'; gp = 4.0; }
        else if (totalMarks >= 75) { grade = 'B'; gp = 3.0; }
        else if (totalMarks >= 65) { grade = 'C'; gp = 2.0; }
        else if (totalMarks >= 50) { grade = 'D'; gp = 1.0; }
        else { grade = 'F'; gp = 0.0; }

        if (result) {
            result.marks = totalMarks;
            result.grade = grade;
            result.gradePoints = gp;
            await result.save();
        } else {
            const course = await Course.findById(assignment.course);
            await Result.create({
                student: req.params.studentId,
                course: assignment.course,
                marks: totalMarks,
                grade,
                gradePoints: gp,
                semester: course?.semester || 1
            });
        }

        res.json({ message: 'Marks updated and GPA synchronized', totalMarks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to grade assignment' });
    }
};

// @desc    Upload course material
// @route   POST /api/academic/materials
// @access  Private/Teacher
const createMaterial = async (req, res) => {
    const { title, description, courseId, fileUrl, fileType, fileSize } = req.body;

    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        // Verify teacher is assigned to this course
        const teacher = await User.findById(req.user._id);
        const isAssigned = course.teacher?.toString() === req.user._id.toString() || 
                           teacher.assignedCourses?.some(id => id.toString() === courseId.toString());
                           
        if (!isAssigned) {
            return res.status(403).json({ message: 'You can only upload materials for your assigned courses' });
        }

        const material = new Material({
            title,
            description,
            fileUrl: fileUrl || 'https://example.com/placeholder.pdf',
            fileType: fileType || 'PDF',
            fileSize: fileSize || '1.0 MB',
            course: courseId,
            teacher: req.user._id
        });

        const savedMaterial = await material.save();
        res.status(201).json(savedMaterial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error: Failed to upload material' });
    }
};

// @desc    Get materials for a teacher's courses
// @route   GET /api/academic/materials/teacher
// @access  Private/Teacher
const getTeacherMaterials = async (req, res) => {
    try {
        const materials = await Material.find({ teacher: req.user._id })
            .populate('course', 'courseName courseCode')
            .sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch materials' });
    }
};

// @desc    Get materials for student's enrolled courses
// @route   GET /api/academic/materials/student
// @access  Private/Student
const getStudentMaterials = async (req, res) => {
    try {
        const student = await User.findById(req.user._id);
        const materials = await Material.find({ course: { $in: student.courses } })
            .populate('course', 'courseName courseCode')
            .populate('teacher', 'name')
            .sort({ createdAt: -1 });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to fetch materials' });
    }
};

module.exports = {
    markAttendance,
    uploadResult,
    calculateGPA,
    getAssignments,
    getStudentAttendance,
    getUpcomingLectures,
    getTeacherStats,
    createAssignment,
    getTeacherAssignments,
    submitAssignment,
    toggleSubmissionCheck,
    gradeAssignment,
    createMaterial,
    getTeacherMaterials,
    getStudentMaterials
};
