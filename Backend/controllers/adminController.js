import User from '../models/userModel.js';

// Get all users categorized by role
export const getAllUsers = async (req, res) => {
  try {
    // Get admin user
    const admin = await User.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Check if user is admin
    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can access this resource.'
      });
    }

    // Fetch all users and categorize them by role
    const allUsers = await User.find().select('-password');
    
    const categorizedUsers = {
      recruiters: allUsers.filter(user => user.role === 'Recruiter'),
      jobseekers: allUsers.filter(user => user.role === 'Jobseeker'),
      admins: allUsers.filter(user => user.role === 'admin')
    };

    return res.status(200).json({
      success: true,
      data: categorizedUsers
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get pending recruiters
export const getPendingRecruiters = async (req, res) => {
  try {
    // Get admin user
    const admin = await User.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Check if user is admin
    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can access this resource.'
      });
    }

    const pendingRecruiters = await User.find({
      role: 'Recruiter',
      isVerified: false
    }).select('-password');

    return res.status(200).json({
      success: true,
      data: pendingRecruiters
    });
  } catch (error) {
    console.error('Error in getPendingRecruiters:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Verify recruiter
export const verifyRecruiter = async (req, res) => {
  try {
    const { id } = req.params;

    // Get admin user
    const admin = await User.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Check if user is admin
    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can access this resource.'
      });
    }

    const recruiter = await User.findById(id);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    if (recruiter.role !== 'Recruiter') {
      return res.status(400).json({
        success: false,
        message: 'User is not a recruiter'
      });
    }

    recruiter.isVerified = true;
    await recruiter.save();

    return res.status(200).json({
      success: true,
      data: recruiter,
      message: 'Recruiter verified successfully'
    });
  } catch (error) {
    console.error('Error in verifyRecruiter:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Ban/Unban recruiter
export const banRecruiter = async (req, res) => {
  try {
    const { id } = req.params;

    // Get admin user
    const admin = await User.findById(req.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin user not found'
      });
    }

    // Check if user is admin
    if (admin.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can access this resource.'
      });
    }

    const recruiter = await User.findById(id);
    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    if (recruiter.role !== 'Recruiter') {
      return res.status(400).json({
        success: false,
        message: 'User is not a recruiter'
      });
    }

    // Toggle ban status
    recruiter.isBanned = !recruiter.isBanned;
    await recruiter.save();

    return res.status(200).json({
      success: true,
      data: recruiter,
      message: recruiter.isBanned ? 'Recruiter banned successfully' : 'Recruiter unbanned successfully'
    });
  } catch (error) {
    console.error('Error in banRecruiter:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 