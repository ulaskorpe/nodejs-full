const nodemailer = require("nodemailer");
const config = require("../config");

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525, // Mailtrap SMTP port
    auth: {
      user: 'ac7a6719d099d2',  
      pass: 'e26a096d0077cb',  
    },
  });
  
  module.exports = transporter;