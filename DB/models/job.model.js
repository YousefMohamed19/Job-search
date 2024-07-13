// schema
// import module
import { Schema, model } from "mongoose";
import { jobLocation ,workingTime,seniorityLevel,technicalSkills,softSkills} from "../../src/utils/const.js";
import { Application } from "./application.model.js";
//create schema
const jobSchema = new Schema({
    jobTitle: {
        type: String,
        required: true
      },
      jobLocation: {
        type: String,
        enum: jobLocation,
        required: true
      },
      workingTime: {
        type: String,
        enum: workingTime,
        required: true
      },
      seniorityLevel: {
        type: String,
        enum: seniorityLevel,
        required: true
      },
      jobDescription: {
        type: String,
        required: true
      },
      technicalSkills:[{
        type: String,
        enum:technicalSkills,
        required: true
      }],
      softSkills: [{
        type: String,
        enum:softSkills,
        required: true
      }],
      addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
      },
      companyId:{
        type: Schema.Types.ObjectId,
        ref: 'Company'
      }
},{timestamps: true});


// Middleware to delete related applications when a job is deleted
jobSchema.pre('findOneAndDelete', async function(next) {
  const job = this; // Access the job being deleted
  const jobId = job._conditions._id; // Extract job id from conditions
  try {
      // Delete applications related to this job
      await Application.deleteMany({ jobId });
      next(); // Move to the next middleware
  } catch (err) {
      next(err); // Pass any error to the next middleware
  }
});


// model 
export const Job = model("Job", jobSchema)