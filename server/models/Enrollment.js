const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    semester: {
        type: Number,
        required: true,
    },
    grade: {
        type: String,
        default: 'N/A',
    },
    status: {
        type: String,
        enum: ['Enrolled', 'Completed', 'Dropped'],
        default: 'Enrolled',
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure a student can only enroll in a specific course once per semester
enrollmentSchema.index({ student: 1, course: 1, semester: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
