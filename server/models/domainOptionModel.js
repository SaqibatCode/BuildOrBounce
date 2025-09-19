// server/models/domainOptionModel.js
import mongoose from 'mongoose';

const DomainOptionSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // We'll store the availability of popular TLDs
  availability: {
    com: Boolean,
    co: Boolean,
    io: Boolean,
  },
  picked: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

export default mongoose.model('DomainOption', DomainOptionSchema);