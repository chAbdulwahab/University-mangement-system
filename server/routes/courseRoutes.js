const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createCourse,
    enrollStudent,
    updateCourse,
    getTeacherCourses,
    getEnrolledStudents,
    getCourses
} = require('../controllers/courseController');

const router = express.Router();

router.use(protect);

router.get('/', getCourses);
router.get('/my-courses', getTeacherCourses);
router.get('/:id/students', getEnrolledStudents);
router.post('/', authorize('Admin'), createCourse);
router.put('/:id', authorize('Admin'), updateCourse);
router.post('/enroll', enrollStudent);

module.exports = router;
