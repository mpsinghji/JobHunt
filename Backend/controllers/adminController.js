import Admin from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin Register
export const registerAdmin = async (req, res) => {
  try {
    const { fullname, email, password, phonenumber, verificationCode } = req.body;
      
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Check if this is the first admin
    const adminCount = await Admin.countDocuments({ role: "admin" });
    const isFirstAdmin = adminCount === 0;

    // If not first admin, verify the verification code
    if (!isFirstAdmin && verificationCode !== process.env.ADMIN_VERIFICATION_CODE) {
      return res.status(403).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    const admin = await Admin.create({
      fullname,
      email,
      password,
      phonenumber,
      role: "admin",
      isVerified: isFirstAdmin, // Only first admin is auto-verified
    });

    return res.status(201).json({
      success: true,
      message: isFirstAdmin 
        ? "Admin registered successfully" 
        : "Admin registration pending verification from super admin",
      data: admin,
    });
  } catch (error) {
    console.error("Error in registerAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if admin is verified
    if (!admin.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your admin account is pending verification",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Set token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Remove password from response
    admin.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: admin,
    });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Admin Logout
export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in logoutAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all users categorized by role
export const getAllUsers = async (req, res) => {
  try {
    // Get admin user
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // Check if user is admin
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can access this resource.",
      });
    }

    // Fetch all users and categorize them by role
    const allUsers = await Admin.find().select("-password");

    const categorizedUsers = {
      recruiters: allUsers.filter((user) => user.role === "Recruiter"),
      jobseekers: allUsers.filter((user) => user.role === "Jobseeker"),
      admins: allUsers.filter((user) => user.role === "admin"),
    };

    return res.status(200).json({
      success: true,
      data: categorizedUsers,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get pending recruiters
export const getPendingRecruiters = async (req, res) => {
  try {
    // Get admin user
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // Check if user is admin
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can access this resource.",
      });
    }

    const pendingRecruiters = await Admin.find({
      role: "Recruiter",
      isVerified: false,
    }).select("-password");

    return res.status(200).json({
      success: true,
      data: pendingRecruiters,
    });
  } catch (error) {
    console.error("Error in getPendingRecruiters:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Verify recruiter
export const verifyRecruiter = async (req, res) => {
  try {
    const { id } = req.params;

    // Get admin user
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // Check if user is admin
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can access this resource.",
      });
    }

    const recruiter = await Admin.findById(id);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    if (recruiter.role !== "Recruiter") {
      return res.status(400).json({
        success: false,
        message: "Admin is not a recruiter",
      });
    }

    recruiter.isVerified = true;
    await recruiter.save();

    return res.status(200).json({
      success: true,
      data: recruiter,
      message: "Recruiter verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyRecruiter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Ban/Unban recruiter
export const banRecruiter = async (req, res) => {
  try {
    const { id } = req.params;

    // Get admin user
    const admin = await Admin.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // Check if user is admin
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admins can access this resource.",
      });
    }

    const recruiter = await Admin.findById(id);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    if (recruiter.role !== "Recruiter") {
      return res.status(400).json({
        success: false,
        message: "Admin is not a recruiter",
      });
    }

    // Toggle ban status
    recruiter.isBanned = !recruiter.isBanned;
    await recruiter.save();

    return res.status(200).json({
      success: true,
      data: recruiter,
      message: recruiter.isBanned
        ? "Recruiter banned successfully"
        : "Recruiter unbanned successfully",
    });
  } catch (error) {
    console.error("Error in banRecruiter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
