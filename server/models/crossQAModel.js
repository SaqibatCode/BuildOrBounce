// server/models/crossQAModel.js
import mongoose from 'mongoose';

const CrossQASchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('CrossQA', CrossQASchema);