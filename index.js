// import module 
import express from 'express';
import jwt from 'jsonwebtoken';
import { connectDb } from './DB/connection.js';
import { globalErrorHandler } from './src/middleware/asyncHandler.js';
import { authRouter, userRouter , companyRouter, jobRouter} from './src/index.js';
import { User , Company} from './DB/index.js';
import dotenv from 'dotenv';
import cloudinary from './src/utils/cloudinaryConfig.js';

dotenv.config();
//create server
const app = express();
const port = 3000
// create parsing
app.use(express.json());
// call connection
connectDb()
// import routes
app.use('/auth',authRouter)
app.use('/users',userRouter)
app.use('/company',companyRouter)
app.use('/job',jobRouter)
//api for verify Email
app.get('/auth/verify-email/:token', async(req, res,next) => {

const { token } = req.params
const payload = jwt.verify(token,process.env.JWT_SECRET)
if(payload.email){
    await User.findOneAndUpdate({email:payload.email},{verifyEmail:true})
}
if(payload.companyEmail){
    await Company.findOneAndUpdate({companyEmail:payload.companyEmail},{isVerified:true})
}
return res.status(200).json({message:'Email verified successfully'})
})
// call global error handler
app.use(globalErrorHandler)
//listen server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
