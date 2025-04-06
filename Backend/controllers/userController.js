import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import multer from "multer";

// Update the upload middleware configuration
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/");
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    }),
    fileFilter: function (req, file, cb) {
        if (file.fieldname === "profilePhoto") {
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("Not an image! Please upload an image."), false);
            }
        } else if (file.fieldname === "resume") {
            if (file.mimetype === "application/pdf") {
                cb(null, true);
            } else {
                cb(new Error("Please upload a PDF file"), false);
            }
        } else {
            cb(null, true);
        }
    },
});

export const Register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password, role } = req.body;
    if (!fullname || !email || !phonenumber || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hashPassword,
      phonenumber,
      role,
    });
    return res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email is not registered", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }
    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with current role",
        success: false,
      });
    }
    const tokenData = {
      UserId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phonenumber: user.phonenumber,
      role: user.role,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      socialMediaLinks: user.socialMediaLinks,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      })
      .json({
        message: `Welcome Back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const updateprofile = async (req, res) => {
    try {
        console.log("Update profile request:", {
            body: req.body,
            files: req.files,
            userId: req.id
        });

        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Handle profile photo upload
        if (req.files && req.files.profilePhoto) {
            const result = await cloudinary.uploader.upload(req.files.profilePhoto[0].path, {
                folder: "profile_photos",
                resource_type: "auto"
            });
            user.profile.profilePhoto = {
                url: result.secure_url,
                publicId: result.public_id
            };
            fs.unlinkSync(req.files.profilePhoto[0].path);
        }

        // Handle resume upload
        if (req.files && req.files.resume) {
            const result = await cloudinary.uploader.upload(req.files.resume[0].path, {
                folder: "resumes",
                resource_type: "raw",
                format: "pdf"
            });
            user.profile.resume = {
                url: result.secure_url,
                publicId: result.public_id,
                originalName: req.files.resume[0].originalname,
                updatedAt: new Date()
            };
            fs.unlinkSync(req.files.resume[0].path);
        }

        // Update user information
        if (req.body.fullname) user.fullname = req.body.fullname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.phonenumber) user.phonenumber = parseInt(req.body.phonenumber);
        if (req.body.address) user.address = req.body.address;
        if (req.body.gender) user.gender = req.body.gender;
        if (req.body.dob) user.dob = req.body.dob;
        if (req.body.profile?.bio) user.profile.bio = req.body.profile.bio;
        
        // Process skills as an array
        if (req.body.profile?.skills) {
            // If skills is a string, split by comma and trim whitespace
            if (typeof req.body.profile.skills === 'string') {
                user.profile.skills = req.body.profile.skills.split(',').map(skill => skill.trim());
            } else if (Array.isArray(req.body.profile.skills)) {
                // If it's already an array, use it directly
                user.profile.skills = req.body.profile.skills;
            }
        }
        
        if (req.body.socialMediaLinks) user.socialMediaLinks = req.body.socialMediaLinks;

        await user.save();

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
};

export const removeProfilePhoto = async (req, res) => {
  try {
    const userId = req.id;
    
    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found", 
        success: false 
      });
    }
    
    // Check if user has a profile photo
    if (!user.profile?.profilePhoto) {
      return res.status(400).json({ 
        message: "No profile photo to remove", 
        success: false 
      });
    }
    
    // Delete the image from Cloudinary
    try {
      await cloudinary.uploader.destroy(user.profile.profilePhoto.publicId);
      console.log("Profile photo deleted from Cloudinary");
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
      // Continue with the update even if Cloudinary deletion fails
    }
    
    // Remove the profile photo from the user document
    user.profile.profilePhoto = undefined;
    await user.save();
    
    // Return the updated user without the password
    const updatedUser = await User.findById(userId).select("-password");
    
    return res.status(200).json({
      message: "Profile photo removed successfully",
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Remove profile photo error:", error);
    return res.status(500).json({ 
      message: "Failed to remove profile photo", 
      success: false,
      error: error.message 
    });
  }
};

// for testing only
export const getallusers = async (req, res) => {
  try {
    // const users = await User.find();
    const users = await User.find().select("email role");
    return res.status(200).json({ users, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// Add new function to remove resume
export const removeResume = async (req, res) => {
    try {
        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.profile.resume) {
            return res.status(400).json({
                success: false,
                message: "No resume found to remove"
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(user.profile.resume.publicId, {
            resource_type: "raw"
        });

        // Remove resume from user profile
        user.profile.resume = undefined;
        await user.save();

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            success: true,
            message: "Resume removed successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Remove resume error:", error);
        res.status(500).json({
            success: false,
            message: "Error removing resume",
            error: error.message
        });
    }
};

// Add new function to rename resume
export const renameResume = async (req, res) => {
    try {
        const { newName } = req.body;
        if (!newName) {
            return res.status(400).json({
                success: false,
                message: "New name is required"
            });
        }

        const user = await User.findById(req.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.profile.resume) {
            return res.status(400).json({
                success: false,
                message: "No resume found to rename"
            });
        }

        // Update resume name
        user.profile.resume.originalName = newName;
        await user.save();

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.status(200).json({
            success: true,
            message: "Resume renamed successfully",
            user: userWithoutPassword
        });
    } catch (error) {
        console.error("Rename resume error:", error);
        res.status(500).json({
            success: false,
            message: "Error renaming resume",
            error: error.message
        });
    }
};
