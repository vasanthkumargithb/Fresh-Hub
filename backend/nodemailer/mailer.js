import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lpcxxsimulators@gmail.com',
        pass: 'cppdqbpheuvshopf'
        },
});

export const sendMail = async (to, subject, text, html) => {
    try { 
    console.log(to,subject,text,html);
        const mailOptions = {
            from: '"Fresh-Hub" <noreply@freshhub.com>',
            to: to,
            subject: subject,
            text: text,
            html: html,
        };

        console.log(mailOptions);

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};
