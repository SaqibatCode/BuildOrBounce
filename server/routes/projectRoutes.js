import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
    getProjectById,
    createProject,
    validateProject,
    saveCrossQA,
    getDomainSuggestions,
    selectDomain,
    generateBrandKit,
    overrideVerdict,
    generateWebsite,
    getProjectsForUser,
    getLogoOptions
} from '../controllers/projectController.js';

const router = express.Router();

router.get('/', protect, getProjectsForUser);
router.get('/:id', protect, getProjectById);
router.get('/:id/logo-options', protect, getLogoOptions);
router.post('/', protect, createProject);
router.post('/:id/validate', protect, validateProject);
router.post('/:id/cross-qa', protect, saveCrossQA);
router.post('/:id/domains', protect, selectDomain);
router.post('/:id/brand-kit', protect, generateBrandKit);
router.post('/:id/website', protect, generateWebsite);
router.patch('/:id/override-verdict', protect, overrideVerdict);
router.get('/:id/domains', protect, getDomainSuggestions);


export default router;