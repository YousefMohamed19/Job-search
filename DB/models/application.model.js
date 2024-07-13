//schema
//import modules
import { Schema, model } from "mongoose";
import { technicalSkills,softSkills } from "../../src/utils/const.js";
// create schema
const applicationSchema = new Schema({ jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userTechSkills: [{
    type: String,
    enum:technicalSkills,
    required: true
  }],
  userSoftSkills:[ {
    type: String,
    enum:softSkills,
    required: true
  }],
  userResume: {
    type: String,
    
  }
},
{timestamps: true})
//model
export const Application = model("Application", applicationSchema)