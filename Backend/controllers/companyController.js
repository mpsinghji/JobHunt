import Company from "../models/companyModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import fs from "fs";

export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res
        .status(400)
        .json({ message: "Company name is required", success: false });
    }
    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res
        .status(400)
        .json({ message: "Company already exists", success: false });
    }
    company = await Company.create({
      name: companyName,
      userId: req.id,
    });
    return res.status(201).json({
      message: "Company created successfully",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message, success: false });
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res
        .status(404)
        .json({ message: "No company found", success: false });
    }
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required"
      });
    }

    const updateData = { name, description, website, location };
    
    // Only handle file upload if a file is provided
    if (file) {
      try {
        // If there's an existing logo, delete it from Cloudinary
        const existingCompany = await Company.findById(req.params.id);
        if (existingCompany?.logo?.publicId) {
          await cloudinary.uploader.destroy(existingCompany.logo.publicId);
        }

        // Upload the new file to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "jobhunt/company_logos",
          resource_type: "auto",
          public_id: `company_logo_${Date.now()}`,
          access_mode: "public"
        });
        
        // Update the logo data
        updateData.logo = {
          url: result.secure_url,
          publicId: result.public_id
        };
        
        // Delete the temporary file
        fs.unlinkSync(file.path);
      } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        return res.status(500).json({ 
          success: false, 
          message: "Error uploading file: " + error.message 
        });
      }
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    
    if (!company) {
      return res.status(404).json({ 
        message: "Company not found", 
        success: false 
      });
    }
    
    return res.status(200).json({ 
      message: "Company data updated successfully", 
      company, 
      success: true 
    });
  } catch (error) {
    console.error("Error in updateCompany:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error" 
    });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await Company.find({ userId });
    if (!companies) {
      return res
        .status(404)
        .json({ message: "No company found", success: false });
    }
    return res.status(200).json({ companies, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//by me
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) {
      return res
        .status(404)
        .json({ message: "Company not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Company deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
