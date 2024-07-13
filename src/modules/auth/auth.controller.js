//import module
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AppError } from '../../utils/appError.js';
import { User } from '../../../DB/index.js';
import { sendEmail } from '../../utils/sendEmail.js';

// sign up
export const signUp = async (req, res,next) => {
    //distract data
    const {firstName, lastName,email, password,recoveryEmail,DOB,mobileNumber,role} = req.body
    
     // Check for existing user
     const userExists = await User.findOne({ email });
     if (userExists) {
        next(new AppError('User already exists',400));
     }
     // hash password
     const hashedPassword = bcrypt.hashSync(password, 10);
     // prepare user object
    const user = new User({
        firstName,
        lastName,
        username:firstName+' '+lastName,
        email, 
        password: hashedPassword, 
        recoveryEmail, 
        DOB, 
        mobileNumber, 
        role 
    });
 
    const createdUser = await user.save()   //save to DB
    createdUser.password = undefined        // hide password
    const token = jwt.sign({ email }, process.env.JWT_SECRET);  // create token
    sendEmail( email, token );                          // send email
    return res.status(201).json({ message: "user created successfully", success: true, data: createdUser }); //response
}


// sign in
export const signIn = async (req, res,next) => {
    // distract data
    const { email, recoveryEmail,mobileNumber, password } = req.body
    // Check for existing user
    const userExist = await User.findOne({ $or: [{ email }, { recoveryEmail }, { mobileNumber }] })
    if (!userExist) {
        next(new AppError('invalid credentials', 401))
        }

    // check if user is verified Email
    if(userExist.verifyEmail===false){
        return next(new AppError('please verify your email', 401))
    }
    
    // compare password
    const match = bcrypt.compareSync(password, userExist.password)
    if (!match) {
    next(new AppError('invalid credentials', 401))
    }
    // update status
    const user = await User.findOneAndUpdate({ $or: [{ email }, { recoveryEmail }, { mobileNumber }] },{status:'online'},{new:true})
    // create token to login
    const accessToken = jwt.sign({email: userExist.email,userId: userExist._id, role: userExist.role,status:user.status,mobileNumber:userExist.mobileNumber}, process.env.JWT_SECRET)
    return res.status(200).json({ message: 'login successfully', success: true, accessToken })
}