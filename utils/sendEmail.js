const nodemailer = require('nodemailer');

const sendEmail = async(options) => {
 // 1) Create transporter ( service that will send email like "gmail" , "Mailgun" , sendCrid )
 const transporter = nodemailer.createTransport({
    host : process.env.EMAIL_HOST ,
    port: process.env.EMAIL_PORT, // if secure false port = 587 , if true port= 465
    secure: true ,
    auth: {
     user: process.env.EMAIL_USER,
     pass: process.env.EMAIL_PASSWWORD,
   } 
 }) 
 // 2) Define email options (like from , to, subject, email content) 
 const mailOpts = {
    from: 'E-shop App <mokiedabood@gmail.com',
    to : options.email,
    subject: options.subject,
    text: options.message,
    //   html: `
    //   <h2 style="color: #007bff;">${options.subject}</h2>
    //   <p>${options.message}</p>
    //   <p style="color: gray;">مع تحيات فريق E-Shop 💼</p>
    // `,
    // attachments: options.attachments || []
  
} 
 // 3) Send Email
 await transporter.sendMail(mailOpts)
};


module.exports = sendEmail;