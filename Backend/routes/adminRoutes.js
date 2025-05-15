import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { getPendingRecruiters, verifyRecruiter } from '../controllers/adminController.js';

const router = express.Router();

// Get pending recruiters
router.get('/pending-recruiters', isAuthenticated, getPendingRecruiters);

// Verify recruiter
router.post('/verify-recruiter/:id', isAuthenticated, verifyRecruiter);

export default router; 