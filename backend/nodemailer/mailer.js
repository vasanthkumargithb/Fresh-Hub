import nodemailer from 'nodemailer';

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Gmail service
    auth: {
        user: "sktigpta@gmail.com",  // Sender's email
        pass: "weji rafh tnkg xhlj",  // App password
    },
    tls: {
        rejectUnauthorized: false, // Avoid unauthorized errors
    },
    // Explicitly set the port and secure settings for Gmail
    port: 587,  // SMTP port for Gmail
    secure: false,  // Use TLS
});

// Send mail function
export const sendMail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Sender's email
            to: to,  // Recipient's email
            subject: subject,
            text: text,  // Plain text version
            html: html,  // HTML version
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Detailed Error:', error.stack);  // More detailed error logging
        throw error;  // Rethrow the error
    }
};
