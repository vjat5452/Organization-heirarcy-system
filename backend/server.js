const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/org-hierarchy', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB database connection established successfully');
})
.catch((error) => {
    console.log('❌ MongoDB connection error:', error.message);
});

// Import routes
const employeeRoutes = require('./routes/employees');
app.use('/api/employees', employeeRoutes);
console.log('✅ Employee routes loaded');

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'Backend server is running!',
        status: 'OK',
        timestamp: new Date().toISOString()
    });
});

// Test employees route
app.get('/api/test-employees', async (req, res) => {
    try {
        const Employee = require('./models/Employee');
        const employees = await Employee.find();
        res.json({ 
            message: 'Employees route test',
            count: employees.length,
            employees: employees
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Default route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Organization Hierarchy Management System API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            employees: '/api/employees',
            test: '/api/test-employees'
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Backend Server started successfully!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📍 Employees Test: http://localhost:${PORT}/api/test-employees`);
    console.log(`📍 API Base: http://localhost:${PORT}/`);
});