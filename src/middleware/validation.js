// import module
import { AppError } from "../utils/appError.js"
// create validation
export const validate=(schema)=>{
    return (req,res,next)=>{
    let data={...req.body,...req.header}  
        const {error}=schema.validate(data,{abortEarly:false})
    if(error){
    const errorArr= error.details.map(ele=>ele.message)
    req.errorArr=errorArr
    return next(new AppError(errorArr,401))
    }
    next()
}
}