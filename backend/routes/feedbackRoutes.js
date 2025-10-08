import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";
import Feedback from '../models/feedback.js';

const router = express.Router();
router.post("/submit", submitFeedback);
router.get('/', async (req, res) => {
  try {
    const allFeedbacks = await Feedback.find().sort({});
    res.status(200).json(allFeedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error); // 👈 log the error
    res.status(500).json({ message: 'Failed to fetch feedbacks' });
  }
});

export default router;
 
