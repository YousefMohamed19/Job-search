// import modules
import nodemailer from 'nodemailer';
// send otp function
export const sendOtp = async (email,otp) => {
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
    subject: "Hello ", // Subject line
    text: `your otp is : ${otp}`, // plain text body
  });
}