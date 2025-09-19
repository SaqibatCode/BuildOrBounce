import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getChatHistory, postMessage } from '../controllers/chatController.js';

const router = express.Router();

router.get('/:projectId/history', protect, getChatHistory);
router.post('/:projectId/message', protect, postMessage);

export default router;