import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    cropType: { type: String },
    experience: { type: Number },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
 
