// server/models/projectModel.js
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  pitch: {
    type: String,
    required: [true, 'Please add a pitch'],
  },
  problem: {
    type: String,
  },
  target_user: {
    type: String,
  },
  channels: {
    type: String,
  },
  monetization: {
    type: String,
  },
  status: {
    type: String,
    default: 'idea',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  validation_report_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ValidationReport',
  },
  cross_qa_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CrossQA',
  }],
  selected_domain_name: {
    type: String,
  },
  brand_kit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandKit',
  },
  website_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Website',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  verdict_overridden: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });



// Mongoose will create a collection named 'projects' based on the string 'Project'
export default mongoose.model('Project', ProjectSchema);