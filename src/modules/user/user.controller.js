// import module
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../../DB/index.js';
import { AppError } from '../../utils/appError.js';
import { sendOtp } from '../../utils/otp.js';
import { sendEmail } from '../../utils/sendEmail.js';
// Update user
export const updateUser = async (req, res,next) => {
    //distract data
    const {firstName,lastName,email,recoveryEmail,DOB,mobileNumber} = req.body
    const {userId,status} = req.user
    // check if user exists
    const userExists = await User.findById(userId)
    if(!userExists){
        next(new AppError('User does not exist',404))
    }
    // check new email does not exist
    if(email !== userExists.email){
        const emailExists = await User.findOne({email})
        await User.updateOne({_id:userId},{verifyEmail:false})
        const token = jwt.sign({ email }, process.env.JWT_SECRET);
        sendEmail( email, token );
        if(emailExists){
            next(new AppError('email already exists',409))
        }
    }
    // check new mobile number does not exist
    if(mobileNumber !== userExists.mobileNumber){
        const mobileNumberExists = await User.findOne({mobileNumber})
        if(mobileNumberExists){
            next(new AppError('mobile number already exists',409))
        }
    }
    //check the status of the user
    if(status !== 'online'){
        next(new AppError('you can not update the data of this user',401))
    }
    
    // update user
    const updatedUser = await User.findByIdAndUpdate({_id:userId},{firstName,lastName,email,recoveryEmail,DOB,mobileNumber,status},{new:true})
    updatedUser.password = undefined    // hide password
    return res.status(200).json({message:'user updated successfully',success:true,data:updatedUser})
}


// delete user
export const deleteUser = async (req, res,next) => {
    // distract data
    const {userId,status} = req.user
    // check if user exists
    const userExists = await User.findById(userId)
    if(!userExists){
        next(new AppError('User does not exist',404))
    }
    // check the status of the user
    if(status !== 'online'){
        next(new AppError('you can not delete the data of this user',401))
    }
    // delete user
    await User.findByIdAndDelete({_id:userId},{new:true})
    return res.status(200).json({message:'user deleted successfully',success:true})
}



// Get user
export const getUser = async (req, res,next) => {
    //distract data
    const {userId,status} = req.user
    // check if user exists
    const userExists = await User.findById(userId)
    if(!userExists){
        next(new AppError('User does not exist',404))
    }
    // check the status of the user
    if(status !== 'online'){
        next(new AppError('you can not get the data of this user',401))
    }

    // get user
    userExists.password = undefined         // hide password

    return res.status(200).json({message:'user fetched successfully',success:true,data:userExists})
}


// Get anthor user
export const getAnthorUser = async (req, res,next) => {
    // distract data
    const {userId} = req.params
    // check if user exists
    const userExists = await User.findById(userId)
    if(!userExists){
        next(new AppError('User you are looking for does not found',404))
    }
    // get user
    userExists.password = undefined         // hide password
    return res.status(200).json({message:'user fetched successfully',success:true,data:userExists})
}


// update password
export const updatePassword = async (req, res,next) => {
    // distract data
    const {oldPassword,newPassword} = req.body
    const {userId,status} = req.user
    // check if user exists
    const userExists = await User.findById(userId)
    if(!userExists){
        next(new AppError('User does not exist',404))
    }
    // check the status of the user
    if(status !== 'online'){
        next(new AppError('you can not update the data of this user',401))
    }
    // check old password is correct
    const checkPassword = await bcrypt.compare(oldPassword, userExists.password)
    if(!checkPassword){
        next(new AppError('your old password is wrong',401))
    }
    // check new password is not the same
    if(oldPassword === newPassword){
        next(new AppError('new password can not be the same as old password',401))
    }
    // update password
    // hash password
    const hashedPassword =  bcrypt.hashSync(newPassword,10)
    userExists.password = hashedPassword
    await userExists.save()    // save data
    return res.status(200).json({message:'password updated successfully',success:true})
}






// forget password
export const forgetPassword = async (req, res,next) => {
    // distract data
    const {email} = req.body
    // check if user exists
    const userExists = await User.findOne({email})
    if(!userExists){
        next(new AppError('User does not exist',404))
    }
    // create otp
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    userExists.otp = otp
    userExists.otpExpires = Date.now() 
    await userExists.save()
    sendOtp(email,otp)              // send otp to gmail
    return res.status(200).json({message:'otp sent successfully',success:true})
}




//reset password
export const resetPassword = async (req, res,next) => {
    // distract data
    const {email,otp,password} = req.body
    // check if user exists
    const userExists = await User.findOne({email})
    if(!userExists){
        next(new AppError('User does not exist',404))
    }
    // check if otp is correct
    if(otp !== userExists.otp){
        next(new AppError('Invalid otp',401))
    }
    // check if otp is expired
    if(Date.now() > new Date(userExists.otpExpires).getTime()*1000000){
        next(new AppError('otp expired',401))
    }
    // hash password
    const hashedPassword =  bcrypt.hashSync(password,10)
    userExists.password = hashedPassword
    userExists.otp = null                               // remove otp
    userExists.otpExpires = null                        // remove otpExpires
    await userExists.save()
    return res.status(200).json({message:'password updated successfully',success:true})
}


// Get all accounts associated to a specific recovery Email 
export const getRecoveryEmail = async (req, res,next) => {
    const {recoveryEmail} = req.params
    // check if recoveryEmail exists
    if(!recoveryEmail){
        next(new AppError('recovery email does not exist',404))
    }
    // check if user exists
    const userExists = await User.find({recoveryEmail:recoveryEmail})
    if(!userExists){
        next(new AppError('User does not exist',404))
    }
    // get user
    return res.status(200).json({message:'user fetched successfully',success:true,data:userExists})
}