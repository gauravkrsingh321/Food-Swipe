const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },      
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength:[6,"Password must be 6 characters long"],
        required:true
    }
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;