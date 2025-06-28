// models/Trip.js
const mongoose = require("mongoose");

const uploadedImageSchema = new mongoose.Schema({
  preview: String,
  takenAt: Date,
});

const tripSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID
  title: String,
  startDate: Date,
  endDate: Date,
  dateImages: {
    type: Map,
    of: [uploadedImageSchema], // Map<string, UploadedImage[]>
    default: {},
  },
  dateDescriptions: {
    type: Map,
    of: String, // Map<string, string>
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model("Trip", tripSchema);
