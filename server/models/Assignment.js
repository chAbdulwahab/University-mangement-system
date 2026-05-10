const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    fileUrl: String, // Link to attachment (Cloudinary)
    submissions: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        fileUrl: String,
        submittedAt: { type: Date, default: Date.now },
        marks: { type: Number, default: 0 },
        isChecked: { type: Boolean, default: false }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
