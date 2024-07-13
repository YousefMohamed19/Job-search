// import module
import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validation.js";
import {  deleteUser, forgetPassword, getAnthorUser, getRecoveryEmail, getUser, resetPassword, updatePassword, updateUser } from "./user.controller.js";
import { auth } from "../../middleware/authentication.js";
import { passwordVal, userVal } from "./user.validate.js";
// Main Router
export const userRouter = Router()
// Router for api 
// update user Router
userRouter.put('/update',auth,validate(userVal),asyncHandler(updateUser))
// Delete user Router
userRouter.delete('/delete',auth,asyncHandler(deleteUser))
// Get user Router
userRouter.get('/get',auth,asyncHandler(getUser))
// Get another user Router
userRouter.get('/get/:userId',auth,asyncHandler(getAnthorUser))
// update password Router
userRouter.put('/update-password',auth,validate(passwordVal),asyncHandler(updatePassword))
// forget password Router
userRouter.post('/forgot-password',asyncHandler(forgetPassword))
// reset password Router
userRouter.post('/reset-password',asyncHandler(resetPassword))
// GetRecoveryEmail Router
userRouter.get('/accounts/:recoveryEmail',auth,asyncHandler(getRecoveryEmail))