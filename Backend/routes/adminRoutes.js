import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { 
  getPendingRecruiters, 
  verifyRecruiter, 
  getAllUsers, 
  banRecruiter,
  registerAdmin,
  loginAdmin,
  logoutAdmin
} from '../controllers/adminController.js';

const router = express.Router();

// Admin Authentication routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/logout', logoutAdmin);

// Get all users
router.get('/users', isAuthenticated, getAllUsers);

// Get pending recruiters
router.get('/pending-recruiters', isAuthenticated, getPendingRecruiters);

// Verify recruiter
router.post('/verify-recruiter/:id', isAuthenticated, verifyRecruiter);

// Ban/Unban recruiter
router.post('/ban-recruiter/:id', isAuthenticated, banRecruiter);

export default router; 