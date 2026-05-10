const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['Admin', 'Teacher', 'Student', 'Staff'],
        default: 'Student',
    },
    // Student specific fields
    rollNumber: String,
    semester: Number,
    department: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    attendance: [{
        date: Date,
        status: String,
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
    }],
    results: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        marks: Number,
        grade: String
    }],
    // Teacher specific fields
    assignedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }],
    timetable: [{
        day: String,
        time: String,
        subject: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
