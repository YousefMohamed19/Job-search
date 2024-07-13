import jwt from 'jsonwebtoken'
import { Application, Company,Job } from "../../../DB/index.js";
import {AppError} from "../../utils/appError.js";
import { sendEmail } from '../../utils/sendEmail.js';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import excel from 'exceljs';
// add company
export const addCompany = async (req, res, next) => {
        const { companyName, description, industry, address, numberOfEmployees, companyEmail,companyHR} = req.body;
        //check if company exists
        const companyExists = await Company.findOne({ companyEmail });
        if (companyExists) {
            return next(new AppError('Company already exists', 409));
        }
        //prpear data
        const newCompany = new Company({
            companyName,
            description,
            industry,
            address,
            numberOfEmployees,
            companyEmail,
            companyHR
        });
        const createdCompany = await newCompany.save()             // save data
        const token = jwt.sign({ companyEmail }, process.env.JWT_SECRET); //    create token
        sendEmail( companyEmail, token );                           //send email
        return res.status(201).json({ message: 'Company added successfully', success: true, data: createdCompany });//response
    };

 
// update company
export const updateCompany = async (req, res, next) => {
    const { userId } = req.user;
    const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;
    // Check if the company exists by companyHR
    const company = await Company.findOne({ companyHR: userId });
    if (!company) {
        return next(new AppError('Company does not exist', 404));
    }
    // Check if the company exists by companyEmail
    if(companyEmail !== company.companyEmail){
        const emailExists = await Company.findOne({companyEmail})
        await Company.updateOne({_id:userId},{isVerified:false})
        const token = jwt.sign({ companyEmail }, process.env.JWT_SECRET);
        sendEmail( companyEmail, token );
        if(emailExists){
            next(new AppError('email already exists',409))
        }
    }
    // Prepare data and update
    const updatedCompany = await Company.findOneAndUpdate(
        { companyHR: userId },
        {
            companyName,
            description,
            industry,
            address,
            numberOfEmployees,
            companyEmail
        },
        { new: true }
    );
    return res.status(200).json({ message: 'Company updated successfully', success: true, data: updatedCompany });
};

// delete company
export const deleteCompany = async (req, res, next) => {
    const { userId } = req.user;

    // Find the company by companyHR
    const company = await Company.findOne({ companyHR: userId });
    if (!company) {
        return next(new AppError('Company does not exist', 404));
    }

    // Delete the company
    await Company.findOneAndDelete({ companyHR: userId });

    return res.status(200).json({ message: 'Company deleted successfully', success: true });
};


// get company with jobs
export const getCompany = async (req, res, next) => {
    const { companyId } = req.params;

    // Find the company by companyId
    const company = await Company.findOne({_id:companyId});
    if (!company) {
        return next(new AppError('Company does not exist', 404));
    }
    // Find all jobs related to the company
    const jobs = await Job.find({ addedBy: company.companyHR });

    return res.status(200).json({
        message: 'Company data fetched successfully',
        success: true,
        data: {
            company,
            jobs
        }
    });
};


//search by name
export const searchCompany = async (req, res, next) => {
    const { name } = req.query;
    // Find companies by name
    const companies = await Company.find({ companyName: new RegExp(name, 'i') });
    // Check if companies exists
    if (!companies.length) {
        return next(new AppError('No companies found with this name', 404));
    }

    return res.status(200).json({ message: 'Companies fetched successfully', success: true, data: companies });
};


// get app for job
export const getApplicationsForJob = async (req, res, next) => {
    const { userId } = req.user;
    const { jobId } = req.params;
        // Find the job by jobId
        const job = await Job.findById({addedBy:userId, _id:jobId});
        if (!job) {
            return next(new AppError('Job does not exist', 404));
        }   
        // Find applications for the job
        const applications = await Application.find({ jobId }).populate('userId');
        if(!applications) {
            return next(new AppError('No applications found for this job', 404));
        }

        return res.status(200).json({
            message: 'Applications fetched successfully',
            success: true,
            data: applications
        });
}




// generate excel
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// endpoint for getting applications by company and date in excel
export const getApplicationsByCompanyAndDate = async (req, res, next) => {
    const { companyId } = req.params;
    const { date } = req.query;

    // Construct date range for the query
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch applications for the company on the specified date
    const applications = await Application.find({
        jobId: { $in: await Job.find({ companyId }, '_id') },
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate('userId', 'username email'); // Populate user details

    if (!applications || applications.length === 0) {
        return res.status(404).json({ message: 'No applications found for the specified date', success: false });
    }

    // Create Excel workbook
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Applications');

    // Define columns
    worksheet.columns = [
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Tech Skills', key: 'techSkills', width: 40 },
        { header: 'Soft Skills', key: 'softSkills', width: 40 },
        { header: 'Resume URL', key: 'resumeURL', width: 50 },
        { header: 'createdAt', key: 'createdAt', width: 20 }
    ];

    // Populate rows with application data
    applications.forEach(application => {
        worksheet.addRow({
            email: application.userId.email,
            jobTitle: application.jobId.jobTitle,
            techSkills: application.userTechSkills.join(', '),
            softSkills: application.userSoftSkills.join(', '),
            resumeURL: application.userResume,
            createdAt: application.createdAt.toLocaleString()
        });
    });

    // Generate Excel file
    const fileName = `applications_${companyId}_${date.replace(/-/g, '_')}.xlsx`;
    const filePath = path.join(__dirname, '..', '..', 'excelsheets', fileName);

    try {
        // Ensure the excelsheets directory exists
        const excelsheetsDir = path.join(__dirname, '..', '..', 'excelsheets');
        if (!fs.existsSync(excelsheetsDir)) {
            fs.mkdirSync(excelsheetsDir, { recursive: true });
        }

        // Write the Excel file
        await workbook.xlsx.writeFile(filePath);

        // Send success response
        res.status(200).json({ message: 'Excel file generated successfully', success: true, filePath });
    } catch (error) {
        console.error('Error generating Excel:', error);
        return res.status(500).json({ message: 'Failed to generate Excel file', success: false });
    }

};
