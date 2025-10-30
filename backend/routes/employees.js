const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET all employees - SIMPLIFIED VERSION
router.get('/', async (req, res) => {
    try {
        console.log('GET /api/employees called');
        const employees = await Employee.find().populate('manager', 'name email position employeeType');
        console.log(`Found ${employees.length} employees`);
        res.json(employees);
    } catch (error) {
        console.error('Error in GET /api/employees:', error);
        res.status(500).json({ message: error.message });
    }
});

// GET specific employee
router.get('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
            .populate('manager', 'name email department position employeeType');
        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST new employee - SIMPLIFIED VERSION
router.post('/', async (req, res) => {
    try {
        console.log('POST /api/employees called with data:', req.body);
        
        const { name, email, department, manager, position, employeeType } = req.body;

        // Check if email already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create new employee - simplified validation for now
        const newEmployee = new Employee({ 
            name, 
            email, 
            department, 
            manager: manager || null,
            position,
            employeeType: employeeType || 'Employee'
        });
        
        const savedEmployee = await newEmployee.save();
        const populatedEmployee = await Employee.findById(savedEmployee._id)
            .populate('manager', 'name email position employeeType');
        
        console.log('Employee created successfully:', populatedEmployee._id);
        res.status(201).json(populatedEmployee);
    } catch (error) {
        console.error('Error in POST /api/employees:', error);
        res.status(400).json({ message: error.message });
    }
});

// UPDATE employee
router.put('/:id', async (req, res) => {
    try {
        const { name, email, department, manager, position, employeeType } = req.body;
        
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.department = department || employee.department;
        employee.position = position || employee.position;
        employee.employeeType = employeeType || employee.employeeType;
        employee.manager = manager || employee.manager;

        const updatedEmployee = await employee.save();
        const populatedEmployee = await Employee.findById(updatedEmployee._id)
            .populate('manager', 'name email position employeeType');
        res.json(populatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE employee
router.delete('/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;