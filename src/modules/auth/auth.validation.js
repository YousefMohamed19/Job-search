// import module
import joi from 'joi'

// signup validation
export const signupVal = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('[a-zA-Z0-9]{3,30}$')).required(),
    recoveryEmail: joi.string().email(),
    DOB: joi.string().pattern(new RegExp('^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$')).required(),
    mobileNumber: joi.string().pattern(new RegExp('^01[0125]\\d{8}$')).required(),
    role: joi.string().valid('User', 'Company_HR').required(),
    }).required()



// signin validation
export const signinVal = joi.object({
    email: joi.string().email(),
   recoveryEmail: joi.string().email(),
    mobileNumber: joi.string().pattern(new RegExp('^01[0125]\\d{8}$')),
    password: joi.string().required(),
}).required()