// import module
import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { signIn, signUp} from './auth.controller.js';
import { validate } from '../../middleware/validation.js';
import { signinVal, signupVal } from './auth.validation.js';
// Main Router
export const authRouter = Router();

// router of api
// SignUp Router
authRouter.post('/sign-up',validate(signupVal),asyncHandler(signUp))
// SignIN Router
authRouter.post('/sign-in',validate(signinVal),asyncHandler(signIn))

