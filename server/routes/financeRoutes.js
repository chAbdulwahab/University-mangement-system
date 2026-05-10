const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getAllFees,
    updateFeeStatus,
    getMyFees,
    calculateMyFees,
    submitPayment
} = require('../controllers/financeController');

const router = express.Router();

router.use(protect);

router.post('/pay', submitPayment);
router.get('/calculate-fees', calculateMyFees);
router.get('/fees', authorize('Admin'), getAllFees);
router.put('/fees/:id', authorize('Admin'), updateFeeStatus);
router.get('/my-fees', getMyFees);

module.exports = router;
