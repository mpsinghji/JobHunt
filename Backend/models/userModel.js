import mongoose from "mongoose";

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
      enum: ["Jobseeker", "Recruiter"],
      required: true,
    },
    dob: {
      type: Date,
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

const User = mongoose.model("User", userSchema);
export default User;
