// import module
import joi from 'joi'

// user validation
export const userVal = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    recoveryEmail: joi.string().email(),
    DOB: joi.string().pattern(new RegExp('^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$')).required(),
    mobileNumber: joi.string().pattern(new RegExp('^[0-9]{11}$')).required(),
    }).required()

// password validation
export const passwordVal = joi.object({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
}).required()