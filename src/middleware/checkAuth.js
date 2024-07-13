// import module
import { AppError } from "../utils/appError.js"
import { User } from "../../DB/index.js";
// check if role user or company Hr
export const checkAuth = async(req, res, next) => {
    const {userId}=req.user
    const user = await User.findById(userId) 
    if( user.role !=='Company_HR'){
        next(new AppError('Unauthorized to access this route', 403));
    }
    next()
}