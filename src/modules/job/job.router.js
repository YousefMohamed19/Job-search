// import module
import { Router } from 'express';
import { checkAuth } from '../../middleware/checkAuth.js';
import { addJob, applyToJob, deleteJob, getAllJobs, getFilteredJobs, getJobsByCompany, updateJob} from './job.controller.js';
import { validate } from '../../middleware/validation.js';
import { jobVal } from './job.validation.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { auth } from '../../middleware/authentication.js';
import upload from '../../utils/resumConfig.js';
// Main Router
export const jobRouter = Router();

// Router api 

// Add job router 
jobRouter.post('/add',auth,checkAuth,validate(jobVal) ,asyncHandler(addJob));


// update job
jobRouter.put('/update/:jobId',auth,checkAuth,validate(jobVal) ,asyncHandler(updateJob));

// delete job
jobRouter.delete('/delete/:jobId',auth,checkAuth,asyncHandler(deleteJob));
//get all jobs with company
jobRouter.get('/get',auth,asyncHandler(getAllJobs))

// get all job specific company
jobRouter.get('/get-specific',auth,asyncHandler(getJobsByCompany))

/// Get all Jobs that match the filters
jobRouter.get('/filter',auth,asyncHandler(getFilteredJobs))

// Apply to Job
jobRouter.post('/apply/:jobId',auth,upload.single('userResume'),asyncHandler(applyToJob))

