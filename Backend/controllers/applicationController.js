import Job from "../models/jobModel.js";
import Application from "./../models/applicationModel.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    if(!jobId){
        return res.status(400).json({message:"Job Id is required", success:false});
    }
    const existingApplication = await Application.findOne({applicant: userId, job: jobId});
    if(existingApplication){
        return res.status(400).json({message:"You have already applied for this job", success:false});
    }

    const job = await Job.findById(jobId);
    if(!job){
        return res.status(404).json({message:"Job not found", success:false});
    }
    
    const newApplication = await Application.create({
      applicant: userId,
      job: jobId
    });
    
    job.application.push(newApplication._id);
    await job.save();
    
    return res.status(201).json({
      message: "Application submitted successfully", 
      success: true,
      application: newApplication
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ 
      message: error.message || "Error applying for job", 
      success: false 
    });
  }
};


export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
          path:'job',
          options:{sort:{createdAt:-1}},
          populate:{
              path:'companyId',
              options:{sort:{createdAt:-1}},
          }
      });
      if(!application){
          return res.status(404).json({
              message:"No Applications",
              success:false
          })
      };
      return res.status(200).json({
          application,
          success:true
      })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:error.message, success:false});
    }
}


//For Admin to check
export const getApplicants = async (req,res) => {
  try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId).populate({
          path:'applications',
          options:{sort:{createdAt:-1}},
          populate:{
              path:'applicant'
          }
      });
      if(!job){
          return res.status(404).json({
              message:'Job not found.',
              success:false
          })
      };
      return res.status(200).json({
          job, 
          success:true
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message: error.message || "Error fetching applicants",
          success: false
      });
  }
}

export const updateStatus = async (req,res) => {
  try {
      const {status} = req.body;
      const applicationId = req.params.id;
      if(!status){
          return res.status(400).json({
              message:'status is required',
              success:false
          })
      };

      // find the application by applicantion id
      const application = await Application.findOne({_id:applicationId});
      if(!application){
          return res.status(404).json({
              message:"Application not found.",
              success:false
          })
      };

      // update the status
      application.status = status.toLowerCase();
      await application.save();

      return res.status(200).json({
          message:"Status updated successfully.",
          success:true
      });

  } catch (error) {
      console.log(error);
      return res.status(500).json({
          message: error.message || "Error updating application status",
          success: false
      });
  }
}