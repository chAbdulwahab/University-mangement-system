const Fee = require('../models/Fee');

// @desc    Get all fee records (Admin only)
// @route   GET /api/finance/fees
// @access  Private/Admin
const getAllFees = async (req, res) => {
    const fees = await Fee.find({}).populate('student', 'name email rollNumber');
    res.json(fees);
};

// @desc    Update fee payment status
// @route   PUT /api/finance/fees/:id
// @access  Private/Admin
const updateFeeStatus = async (req, res) => {
    const { status, transactionId } = req.body;
    const fee = await Fee.findById(req.params.id);

    if (fee) {
        fee.status = status;
        fee.transactionId = transactionId || fee.transactionId;
        fee.paymentDate = status === 'Paid' ? Date.now() : fee.paymentDate;
        
        const updatedFee = await fee.save();
        res.json(updatedFee);
    } else {
        res.status(404).json({ message: 'Fee record not found' });
    }
};

// @desc    Get student's own fee status
// @route   GET /api/finance/my-fees
// @access  Private
const getMyFees = async (req, res) => {
    const fees = await Fee.find({ student: req.user._id });
    res.json(fees);
};

const User = require('../models/User');

// @desc    Calculate fees based on enrolled credit hours
// @route   GET /api/finance/calculate-fees
// @access  Private
const calculateMyFees = async (req, res) => {
    try {
        const student = await User.findById(req.user._id).populate('courses');
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const RATE_PER_CREDIT = 8000;

        const details = student.courses.map(course => {
            const creditHours = course.creditHours || 0;
            return {
                name: course.courseName,
                code: course.courseCode,
                credits: creditHours,
                lectures: creditHours * 16, // Assuming 16 lectures per credit hour (32 for 2 credits)
                subtotal: creditHours * RATE_PER_CREDIT
            };
        });

        const totalAmount = details.reduce((sum, item) => sum + item.subtotal, 0);
        const totalCredits = details.reduce((sum, item) => sum + item.credits, 0);

        res.json({
            totalCredits,
            ratePerCredit: RATE_PER_CREDIT,
            totalAmount,
            details
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to calculate fees' });
    }
};

// @desc    Submit payment transaction ID
// @route   POST /api/finance/pay
// @access  Private
const submitPayment = async (req, res) => {
    try {
        const { amount, transactionId } = req.body;
        
        // Find if there's an existing pending fee for this student
        let fee = await Fee.findOne({ student: req.user._id, status: 'Pending' });
        
        if (!fee) {
            // Create a new fee record if none exists
            fee = new Fee({
                student: req.user._id,
                amount,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
            });
        }

        fee.transactionId = transactionId;
        fee.status = 'Paid'; // Or 'Processing' if you want a verification step
        fee.paymentDate = Date.now();
        
        const savedFee = await fee.save();
        res.status(201).json(savedFee);
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Failed to submit payment' });
    }
};

module.exports = {
    getAllFees,
    updateFeeStatus,
    getMyFees,
    calculateMyFees,
    submitPayment
};
