// import module
import nodemailer from 'nodemailer';
import { hTMLTemplate } from './htmlTemplate.js';
// send email function
export const sendEmail = async (email,token) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SEND_EMAIL,
          pass: process.env.SEND_EMAIL_PASSWORD,
        },
      });
      // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Yousef Fadel" <${process.env.SEND_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world", // plain text body
    html: hTMLTemplate(token), // html body
  });
  
}