import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phonenumber:{
        type:Number,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Jobseeker","Recruiter"],
        required:true
    },
    // dob:{
    //     type:Date,
    // },
    // gender:{
    //     type:String,
    //     enum:["Male","Female","Other"],
    // },
    // address:{
    //     type:String,
    // },
    // socialMediaLinks:{
    //     linkedin:{type:String},
    //     github:{type:String},
    //     portfolio:{type:String},
    // },
    profile:{
        bio:{type:String},
        skills:{type:String},
        resume:{type:String},  //url rakenge isme
        resumeOriginalName:{type:String},
        companyName:{type:mongoose.Schema.Types.ObjectId,ref:"Company"},  
        profilePhoto:{type:String,default:""},
    },
},{timestamps:true});

const User = mongoose.model("User", userSchema);
export default User;