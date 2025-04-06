import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

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

    const userId = req.id;
    const {
      fullname,
      email,
      phonenumber,
      address,
      gender,
      dob,
      profile,
      socialMediaLinks
    } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Handle profile photo upload
    if (req.files && req.files.profilePhoto && req.files.profilePhoto[0]) {
      const profilePhoto = req.files.profilePhoto[0];
      const result = await cloudinary.uploader.upload(profilePhoto.path, {
        folder: "profiles",
        resource_type: "auto",
      });
      user.profile.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id
      };
      // Clean up the temporary file
      fs.unlinkSync(profilePhoto.path);
    }

    // Handle resume upload
    if (req.files && req.files.resume && req.files.resume[0]) {
      const resume = req.files.resume[0];
      const result = await cloudinary.uploader.upload(resume.path, {
        folder: "resumes",
        resource_type: "auto",
      });
      user.profile.resume = {
        url: result.secure_url,
        publicId: result.public_id,
        originalName: resume.originalname
      };
      // Clean up the temporary file
      fs.unlinkSync(resume.path);
    }

    // Update basic information
    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phonenumber) user.phonenumber = parseInt(phonenumber);
    if (address) user.address = address;
    if (gender) user.gender = gender;
    if (dob) user.dob = new Date(dob);

    // Update profile information
    if (profile) {
      if (profile.bio) user.profile.bio = profile.bio;
      if (profile.skills) {
        user.profile.skills = profile.skills.split(",").map(skill => skill.trim());
      }
    }

    // Update social media links
    if (socialMediaLinks) {
      user.socialMediaLinks = {
        linkedin: socialMediaLinks.linkedin || user.socialMediaLinks.linkedin,
        github: socialMediaLinks.github || user.socialMediaLinks.github,
        portfolio: socialMediaLinks.portfolio || user.socialMediaLinks.portfolio
      };
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(userId).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ 
      message: "Failed to update profile", 
      success: false,
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
