// server/models/brandKitModel.js
import mongoose from 'mongoose';

const BrandKitSchema = new mongoose.Schema({
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  palette: {
    primary: String,
    secondary: String,
    accent: String,
    neutral_light: String,
    neutral_dark: String,
  },
  fonts: {
    heading: String, // e.g., "Poppins"
    body: String,    // e.g., "Lato"
  },
  logoUrl: {
    type: String, // Will store the raw SVG code
    required: true,
  },
  businessCardUrl: { type: String },
}, { timestamps: true });

export default mongoose.model('BrandKit', BrandKitSchema);
