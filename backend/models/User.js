const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String, 
    email: String, 
    password: String,
    role: { type: String, enum: ['adopter', 'staff', 'admin'], required: true },
    otp: { type: String },
    otpExpires: { type: Date },
    likedPets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;