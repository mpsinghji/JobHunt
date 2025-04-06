import express from 'express';
import { getallusers, login, logout, Register, updateprofile, removeProfilePhoto } from '../controllers/userController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { singleUpload, uploadFiles } from '../middleware/multer.js';

const router = express.Router();

router.post("/register", singleUpload, Register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/all", isAuthenticated, getallusers);
router.post("/profile/update", isAuthenticated, uploadFiles, updateprofile);
router.post("/profile/remove-photo", isAuthenticated, removeProfilePhoto);

export default router;