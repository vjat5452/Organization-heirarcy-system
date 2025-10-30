const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    employeeType: {
        type: String,
        required: true,
        // --- THIS IS THE FIX ---
        // Added 'Intern' and 'Other' to the list of allowed values
        enum: ['Org Manager', 'Manager', 'Employee', 'Intern', 'Other'],
        // ----------------------
        default: 'Employee'
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null
    },
    position: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

// Prevent cyclic relationships
EmployeeSchema.methods.hasCyclicRelationship = async function(potentialManagerId) {
    if (!potentialManagerId) return false;
    if (potentialManagerId.equals(this._id)) return true;
    
    let current = await this.model('Employee').findById(potentialManagerId);
    while (current && current.manager) {
        if (current.manager.equals(this._id)) return true;
        current = await this.model('Employee').findById(current.manager);
    }
    return false;
};

module.exports = mongoose.model('Employee', EmployeeSchema);