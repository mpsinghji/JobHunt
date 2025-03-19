import express from 'express';
import { getallusers, login, logout, Register, updateprofile } from '../controllers/userController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post("/register",singleUpload, Register); 
router.post ("/login", login);
router.post("/logout", logout);
router.post("/profile/update",isAuthenticated,singleUpload, updateprofile);
router.get("/all-users", getallusers);

export default router;