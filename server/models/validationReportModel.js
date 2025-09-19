// server/models/validationReportModel.js
import mongoose from 'mongoose';

const ValidationReportSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  // We expect a structured breakdown from the AI
  breakdown: {
    market_potential: String,
    uniqueness: String,
    feasibility: String,
  },
  risks: [
    {
      risk: String,
      mitigation: String,
    }
  ],
  sources: [String],
  summary: {
    type: String,
    required: true,
  },
  verdict: {
    type: String, // "Build" or "Bounce"
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('ValidationReport', ValidationReportSchema);