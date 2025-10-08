import Feedback from "../models/feedback.js";

export const submitFeedback = async (req, res) => {
  const { name, location, cropType, experience, feedback } = req.body;

  try {
    const newFeedback = new Feedback({ name, location, cropType, experience, feedback });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit feedback" });
  }
};
// GET all feedbacks


