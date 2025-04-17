import Job from "../models/jobModel.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      salary,
      jobType,
      companyId,
      experience,
    } = req.body;

    const created_by = req.id;

    if (
      !title ||
      !description ||
      !companyId ||
      !experience ||
      !location ||
      !salary ||
      !jobType ||
      !requirements
    ) {
      const missingFields = [];
      if (!title) missingFields.push("title");
      if (!description) missingFields.push("description");
      if (!companyId) missingFields.push("company");
      if (!experience) missingFields.push("experience");
      if (!location) missingFields.push("location");
      if (!salary) missingFields.push("salary");
      if (!jobType) missingFields.push("jobType");
      if (!requirements) missingFields.push("requirements");

      return res.status(400).json({
        message: `Please fill the following fields: ${missingFields.join(
          ", "
        )}`,
        success: false,
      });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : requirements.split(",").map((req) => req.trim()),
      location,
      experience,
      salary,
      jobType,
      companyId,
      created_by,
    });

    return res.status(201).json({
      message: "new Job Post completed successfully",
      job,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    //yha populate use krna baaki hai
    const jobs = await Job.find(query).populate({
      path:"companyId"
    }).sort({ createdAt: -1 });
    if (!jobs) {
      return res.status(404).json({ message: "No job found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Jobs fetched successfully", jobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const getJobsById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "application",
      populate: {
        path: "applicant",
        select: "_id name email"
      }
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Job found successfully", job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// retrieves admin created jobs
export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const jobs = await Job.find({ created_by: adminId }).populate({
      path: "companyId",
      select: "name logo website"
    });
    if (!jobs) {
      return res.status(404).json({ message: "No job found", success: false });
    }
    return res
      .status(200)
      .json({ message: "Jobs fetched successfully", jobs, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//created by me
export const updateJob = async (req, res) => {
try {
    const jobId = req.params.id;
    const updates = req.body;
    const options = { new: true };

    const job = await Job.findByIdAndUpdate(jobId, updates, options);

    if (!job) {
        return res.status(404).json({ message: "Job not found", success: false });
    }

    return res
        .status(200)
        .json({ message: "Job updated successfully", job, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }
    await job.deleteOne();
    return res.status(200).json({message: "Job deleted successfully", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message, success: false });
  }
};
