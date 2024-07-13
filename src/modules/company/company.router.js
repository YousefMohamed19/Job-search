import { Router } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { companyVal } from "./company.validation.js";
import { validate } from "../../middleware/validation.js";
import { addCompany, updateCompany,deleteCompany ,getCompany,searchCompany, getApplicationsForJob,getApplicationsByCompanyAndDate} from "./company.controller.js";
import { auth } from "../../middleware/authentication.js";
import { checkAuth } from "../../middleware/checkAuth.js";
// Main router
export const companyRouter = Router();
companyRouter.use(auth)

//  router  api
// add company
companyRouter.post('/create-company', validate(companyVal),checkAuth,asyncHandler(addCompany))
// update company
companyRouter.put('/update-company', validate(companyVal), checkAuth,asyncHandler(updateCompany))
// delete company
companyRouter.delete('/delete-company', checkAuth, asyncHandler(deleteCompany))
// get company
companyRouter.get('/get-company/:companyId', asyncHandler(getCompany))
// search company with name
companyRouter.get('/search',checkAuth,asyncHandler(searchCompany))
// get company applications
companyRouter.get('/get-app/:jobId',checkAuth,asyncHandler(getApplicationsForJob))

// Endpoint to get applications by company and date
companyRouter.get('/applications/:companyId', checkAuth, asyncHandler(getApplicationsByCompanyAndDate));

