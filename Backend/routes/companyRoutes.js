import express from 'express';
import { deleteCompany, getAllCompanies, getCompany, getCompanyById, registerCompany, updateCompany } from '../controllers/companyController.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post("/register", isAuthenticated, registerCompany);
router.get("/get", isAuthenticated, getCompany);
router.get("/get/:id", isAuthenticated, getCompanyById);
router.put("/update/:id", isAuthenticated, singleUpload, updateCompany);
router.get("/all", isAuthenticated, getAllCompanies);
router.delete("/delete/:id", isAuthenticated, deleteCompany);

export default router;