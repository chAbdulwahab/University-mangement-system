const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getStudents,
    getTeachers,
    addUser,
    updateUserDetails,
    deleteUser,
    createDepartment,
    getDepartments,
    getDashboardStats,
    getAnalytics
} = require('../controllers/adminController');

const router = express.Router();

// All routes here are protected and restricted to Admin
router.use(protect);
router.use(authorize('Admin'));

router.get('/students', getStudents);
router.get('/teachers', getTeachers);
router.post('/users', addUser);
router.put('/users/:id', updateUserDetails);
router.delete('/users/:id', deleteUser);
router.post('/departments', createDepartment);
router.get('/departments', getDepartments);
router.get('/stats', getDashboardStats);
router.get('/analytics', getAnalytics);

module.exports = router;
