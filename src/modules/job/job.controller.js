import { Job, Company, Application , User} from '../../../DB/index.js';
import { AppError } from '../../utils/appError.js';




// Add Job
export const addJob = async (req, res, next) => {
    const { userId } = req.user; 
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;

    // Check if user is a company HR
    const company = await Company.findOne({ companyHR: userId });

    // Create and save new job
    const newJob = await Job.create({
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy: userId,
        companyId: company._id
    });

    return res.status(201).json({ message: 'Job added successfully', success: true, data: newJob });
};



// Update Job
export const updateJob = async (req, res, next) => {
    const { userId } = req.user;
    const { jobId } = req.params;
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;
    // Find the job
    const job = await Job.findOne({ _id: jobId, addedBy: userId });
    if (!job) {
        return next(new AppError('Job does not exist or user not authorized to update', 404));
    }
    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
        {_id: jobId},
        { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills },
        { new: true }
    );
    return res.status(200).json({ message: 'Job updated successfully', success: true, data: updatedJob });
};


// Delete Job
export const deleteJob = async (req, res, next) => {
    const { userId } = req.user;
    const { jobId } = req.params;

    // Find the job
    const job = await Job.findOne({ _id: jobId, addedBy: userId });
    if (!job) {
        return next(new AppError('Job does not exist or user not authorized to delete', 404));
    }

    // Delete job
    await Job.findByIdAndDelete(jobId);

    return res.status(200).json({ message: 'Job deleted successfully', success: true });
};


// Get all Jobs with their company's information
export const getAllJobs = async (req, res, next) => {
    const jobs = await Job.find().populate('companyId');

    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, data: jobs });
};


// Get all Jobs for a specific company
export const getJobsByCompany = async (req, res, next) => {
    const { companyName } = req.query;

    const company = await Company.findOne({ companyName });
    if (!company) {
        return next(new AppError('Company does not exist', 404));
    }

    const jobs = await Job.find({ addedBy: company.companyHR });

    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, data: jobs });
};



// Get all Jobs that match the filters
export const getFilteredJobs = async (req, res, next) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;
    let filters = {};

    if (workingTime) filters.workingTime = workingTime;
    if (jobLocation) filters.jobLocation = jobLocation;
    if (seniorityLevel) filters.seniorityLevel = seniorityLevel;
    if (jobTitle) filters.jobTitle = { $regex: jobTitle, $options: 'i' };
    if (technicalSkills) filters.technicalSkills = { $all: technicalSkills.split(',') };
    

    const jobs = await Job.find(filters);

    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, data: jobs });
};



// Apply to Job
export const applyToJob = async (req, res, next) => {
     // distruct userid
     const {userId} = req.user;
     const {jobId} = req.params
     //distruct data from req.body
     const {userTechSkills,userSoftSkills, userResume} = req.body
 // Check if job exists
     const job = await Job.findById(jobId);
     if(!job){
         return next(new AppError('Job not found', 404));
     }
     // Check if user is a user
     const user = await User.findById(userId);
     if (!user || user.role !== 'User') {
         throw new AppError('Unauthorized to access this route', 403);
     }
     
     // Check if file is uploaded
     const file = req.file;
     if (!file) {
       return next(new AppError("No file uploaded", 400));
     }
     //Check if the user has already applied for this job
    const jobExist = await Application.findOne({ jobId, userId });
    if (jobExist) {
        return next(new AppError("You have already applied for this job", 409));
    }
 
   
    // Create and save new application
     const apply = await Application.create({
         jobId,
         userId: userId,
         userTechSkills: userTechSkills.split(','),
         userSoftSkills:userSoftSkills.split(','),
         userResume: file.path, 
     })
     const createdapplication = await apply.save();
     if(!createdapplication){
         return next(new AppError('Application not created', 401));
     }
     return res.status(200).json({ message: 'Application created successfully', success: true, data: createdapplication });
};




