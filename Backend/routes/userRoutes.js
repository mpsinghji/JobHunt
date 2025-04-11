import express from 'express';
import { getallusers, login, logout, Register, updateprofile, removeProfilePhoto, removeResume, renameResume } from '../controllers/userController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { uploadFiles } from '../middleware/multer.js';

const router = express.Router();

// Auth routes
router.post("/register", uploadFiles, Register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/all", isAuthenticated, getallusers);

// Profile routes
router.post("/profile/update", isAuthenticated, uploadFiles, updateprofile);
router.post("/profile/remove-photo", isAuthenticated, removeProfilePhoto);
router.post("/profile/remove-resume", isAuthenticated, removeResume);
router.post("/profile/rename-resume", isAuthenticated, renameResume);

export default router;