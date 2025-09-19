import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserSettings, updateApiKeys, changePassword } from '../controllers/userController.js';

const router = express.Router();

router.get('/settings', protect, getUserSettings);
router.post('/settings/keys', protect, updateApiKeys);
router.post('/settings/password', protect, changePassword);

export default router;