import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { getPendingRecruiters, verifyRecruiter, getAllUsers, banRecruiter } from '../controllers/adminController.js';

const router = express.Router();

// Get all users
router.get('/users', isAuthenticated, getAllUsers);

// Get pending recruiters
router.get('/pending-recruiters', isAuthenticated, getPendingRecruiters);

// Verify recruiter
router.post('/verify-recruiter/:id', isAuthenticated, verifyRecruiter);

// Ban/Unban recruiter
router.post('/ban-recruiter/:id', isAuthenticated, banRecruiter);

export default router; 