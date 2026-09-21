const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, required: true },
  size: { type: String, enum: ["Small", "Medium", "Large"], required: true },
  age: { type: Number, required: true },
  ageUnit: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  shelter: { type: String, required: true },
  description: { type: String },
  isAdopted: { type: Boolean, default: false },
  dateAdded: { type: Date, default: Date.now },
  images: [{ type: String }],
  uploadedBy: { type: String, required: true },
});

const Pet = mongoose.model("Pet", PetSchema);

module.exports = Pet;
