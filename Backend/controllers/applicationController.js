import Job from "../models/jobModel.js";
import Application from "./../models/applicationModel.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const JobId = req.params.id;
    if(!JobId){
        return res.status(400).json({message:"Job Id is required", success:false});
    }
    const existingApplication = await Application.findOne({userId, JobId});
    if(existingApplication){
        return res.status(400).json({message:"You have already applied for this job", success:false});
    }

    const job= await Job.findById(JobId);
    if(!job){
        return res.status(404).json({message:"Job not found", success:false});
    }
    const newApplication = await Application.create({userId, JobId});
    job.application.push(newApplication._id);

    await job.save();
    return res.status(201).json({message:"Application submitted successfully", success:true});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: message.error, success: false });
  }
};


export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application
    } catch (error) {
        console.log(error);
        return res.statusS(500).json({message:error.message, success:false});
    }
}