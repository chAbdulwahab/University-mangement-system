const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/academicController');

const router = express.Router();

router.use(protect);

router.get('/assignments', getAssignments);
router.get('/assignments/teacher', authorize('Teacher'), getTeacherAssignments);
router.post('/assignments', authorize('Teacher'), createAssignment);
router.post('/assignments/:id/submit', authorize('Student'), submitAssignment);
router.put('/assignments/:id/check/:studentId', authorize('Teacher'), toggleSubmissionCheck);
router.put('/assignments/:id/grade/:studentId', authorize('Teacher'), gradeAssignment);
router.get('/attendance/my', getStudentAttendance);
router.get('/lectures/upcoming', getUpcomingLectures);
router.get('/teacher/stats', authorize('Teacher'), getTeacherStats);
router.post('/attendance', authorize('Teacher', 'Admin'), markAttendance);
router.post('/results', authorize('Teacher', 'Admin'), uploadResult);
router.get('/gpa/:studentId/:semester', calculateGPA);

// Course Materials
router.get('/materials/teacher', authorize('Teacher'), getTeacherMaterials);
router.get('/materials/student', authorize('Student'), getStudentMaterials);
router.post('/materials', authorize('Teacher'), createMaterial);

module.exports = router;
