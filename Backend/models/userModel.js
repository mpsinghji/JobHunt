import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phonenumber: {
      type: Number,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Jobseeker", "Recruiter","admin"],
      required: true,
    },
    dob: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
      default: "",
    },
    socialMediaLinks: {
        linkedin: {type: String, default: "" }, 
        github: {type: String, default: "" },
        portfolio: {type: String, default: "" },
    },
    profile: {
      bio: { type: String, default: "" },
      skills: [{ type: String, default: "" }],
      resume: { 
        url: { type: String, default: "" },
        publicId: { type: String, default: "" },
        originalName: { type: String, default: "" }
      },
      companyName: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: { 
        url: { type: String, default: "" },
        publicId: { type: String, default: "" }
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", userSchema);
export default User;
