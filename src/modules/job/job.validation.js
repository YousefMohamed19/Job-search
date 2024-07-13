import joi from 'joi'


export const jobVal = joi.object({
    jobTitle:joi.string().required(),
    jobLocation:joi.string().required(),
    workingTime:joi.string().required(),
    seniorityLevel:joi.string().required(),
    jobDescription:joi.string().required(),
    technicalSkills:joi.array().required(),
    softSkills:joi.array().required(),
}).required()