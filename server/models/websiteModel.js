// server/models/websiteModel.js
import mongoose from 'mongoose';

const WebsiteSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    zipUrl: {
        type: String, // This will be the Google Drive link
        required: true,
    },

    logoUrl: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Website', WebsiteSchema);