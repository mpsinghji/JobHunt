import express from 'express';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { deleteJob, getAdminJobs, getAllJobs, getJobsById, postJob, updateJob } from '../controllers/jobController.js';

const router = express.Router();

router.post('/post', isAuthenticated, postJob);
router.get('/get', isAuthenticated ,getAllJobs);
router.get('/getadminjobs', isAuthenticated ,getAdminJobs);
router.get('/get/:id', isAuthenticated ,getJobsById);
router.put('/update/:id', isAuthenticated ,updateJob);
router.delete('/delete/:id', isAuthenticated ,deleteJob);

export default router;