const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Department = require('./models/Department');
const Course = require('./models/Course');

dotenv.config();

const setupDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully.');

        // 1. Seed Admin
        const adminExists = await User.findOne({ email: 'admin@ums.com' });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: 'admin@ums.com',
                password: 'admin123',
                role: 'Admin',
                department: 'Administration'
            });
            console.log('Admin user created.');
        } else {
            console.log('Admin user already exists.');
        }

        // 2. Seed Departments
        const sampleDepartments = [
            { name: 'Computer Science', code: 'CS' },
            { name: 'Electrical Engineering', code: 'EE' },
            { name: 'Mechanical Engineering', code: 'ME' },
            { name: 'Business Administration', code: 'BA' }
        ];

        for (const dept of sampleDepartments) {
            const exists = await Department.findOne({ code: dept.code });
            if (!exists) {
                await Department.create(dept);
                console.log(`Department ${dept.name} created.`);
            }
        }

        // 3. Seed Faculty (Teachers)
        const sampleFaculty = [
            { name: 'Dr. John Smith', email: 'john@ums.edu', password: '123456', role: 'Teacher', department: 'Computer Science' },
            { name: 'Dr. Maria Garcia', email: 'maria@ums.edu', password: '123456', role: 'Teacher', department: 'Electrical Engineering' },
            { name: 'Prof. James Wilson', email: 'james@ums.edu', password: '123456', role: 'Teacher', department: 'Computer Science' }
        ];

        for (const faculty of sampleFaculty) {
            const exists = await User.findOne({ email: faculty.email });
            if (!exists) {
                await User.create(faculty);
                console.log(`Faculty ${faculty.name} created.`);
            }
        }

        // 4. Seed Students
        const sampleStudents = [
            { name: 'Alice Brown', email: 'alice@ums.edu', password: '123456', role: 'Student', department: 'Computer Science', rollNumber: 'CS-001', semester: 1 },
            { name: 'Bob Johnson', email: 'bob@ums.edu', password: '123456', role: 'Student', department: 'Computer Science', rollNumber: 'CS-002', semester: 1 },
            { name: 'Charlie Davis', email: 'charlie@ums.edu', password: '123456', role: 'Student', department: 'Electrical Engineering', rollNumber: 'EE-001', semester: 2 },
            { name: 'Diana Prince', email: 'diana@ums.edu', password: '123456', role: 'Student', department: 'Computer Science', rollNumber: 'CS-003', semester: 3 },
            { name: 'Ethan Hunt', email: 'ethan@ums.edu', password: '123456', role: 'Student', department: 'Business Administration', rollNumber: 'BA-001', semester: 1 }
        ];

        for (const student of sampleStudents) {
            const exists = await User.findOne({ email: student.email });
            if (!exists) {
                await User.create(student);
                console.log(`Student ${student.name} created.`);
            }
        }

        // 5. Seed Courses
        const sampleCourses = [
            { courseName: 'Introduction to Programming', courseCode: 'CS101', creditHours: 3, semester: 1, department: 'Computer Science' },
            { courseName: 'Data Structures', courseCode: 'CS201', creditHours: 4, semester: 3, department: 'Computer Science' },
            { courseName: 'Circuit Analysis', courseCode: 'EE101', creditHours: 3, semester: 2, department: 'Electrical Engineering' }
        ];

        for (const course of sampleCourses) {
            const exists = await Course.findOne({ courseCode: course.courseCode });
            if (!exists) {
                await Course.create(course);
                console.log(`Course ${course.courseName} created.`);
            }
        }

        console.log('Database setup complete!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

setupDatabase();
