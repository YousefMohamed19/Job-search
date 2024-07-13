// import module
import jwt from 'jsonwebtoken';


// create auth middleware
export const auth =(req,res,next)=>{
    const {authorization} = req.headers
    const [key,token]= authorization.split(' '[0])
    if(key !== 'Bearer'){
        next(new AppError('invalid token', 401))
    }
    const payload = jwt.verify(token,process.env.JWT_SECRET)
    req.user = payload
    next()
}

