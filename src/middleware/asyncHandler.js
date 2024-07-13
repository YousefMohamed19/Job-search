import { AppError } from "../utils/appError.js"

// create function of async handler
export const asyncHandler =(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((err) => {return next( new AppError(err.message,err.statusCode))})
    }
}


// create globale error handler
export const globalErrorHandler = (err,req,res,next)=>{

    if(req.errorArr){
        return res.status(err.statusCode || 500)
        .json({message:req.errorArr,stack:err.stack,success:false})
        }
    return res.status(err.statusCode || 500).json({
        message:err.message,
        stack:err.stack,
        success:false
    })
    }
