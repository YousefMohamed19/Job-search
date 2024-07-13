//schema
//import module
import { Schema, model } from "mongoose";
import { employeeRanges } from "../../src/utils/const.js";
import { Job ,Application} from "../index.js";

//create schema
const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
      },
      description: {
        type: String,
        required: true
      },
      industry: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      numberOfEmployees: { 
        type: String,
        enum: employeeRanges,
        required: true
       },
      companyEmail: {
        type: String,
        required: true,
        unique: true
      },
      companyHR: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      isVerified:{
        type:Boolean,
        default:false
      }
    
},{
    timestamps: true})

    
    // Middleware to delete jobs and applications related to this company HR
    companySchema.pre('findOneAndDelete', async function(next) {
      const conditions = this.getQuery(); // Get the conditions for the query
      const companyHRId = conditions.companyHR; // Extract company HR id from conditions
    
      try {
          // Find jobs related to this company HR
          const jobs = await Job.find({ addedBy: companyHRId });
          const jobIds = jobs.map(job => job._id);
    
          // Delete jobs and applications related to this company HR
          await Promise.all([
              Job.deleteMany({ addedBy: companyHRId }),
              Application.deleteMany({ jobId: { $in: jobIds } })
          ]);
    
          next(); // Move to the next middleware
      } catch (err) {
          next(err); // Pass any error to the next middleware
      }
    });
//model

export const Company = model('Company', companySchema)