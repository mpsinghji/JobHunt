import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
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
    const {
      fullname,
      email,
      phonenumber,
      bio,
      skills,
      gender,
      socialMediaLinks,
      address,
      dob,
    } = req.body;
    const file = req.file;

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req.id;
    let user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phonenumber) user.phonenumber = phonenumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;
    if (gender) user.gender = gender;
    if (address) user.address = address;
    if (dob) user.dob = dob;

    // Handle file upload
    if (file) {
      user.profile.resume = file.buffer.toString('base64');
      user.profile.resumeOriginalName = file.originalname;
    }

    // Update social media links
    if (socialMediaLinks) {
      user.socialMediaLinks = {
        linkedin: socialMediaLinks.linkedin || user.socialMediaLinks.linkedin,
        github: socialMediaLinks.github || user.socialMediaLinks.github,
        portfolio:
          socialMediaLinks.portfolio || user.socialMediaLinks.portfolio,
      };
    }

    await user.save();
    user = await User.findById(userId).select("-password");

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
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
