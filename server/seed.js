const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        const adminExists = await User.findOne({ email: 'admin@ums.com' });
        
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@ums.com',
            password: 'admin123',
            role: 'Admin',
            department: 'Administration'
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@ums.com');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
