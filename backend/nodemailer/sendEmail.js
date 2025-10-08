import { sendMail } from "./mailer.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Resolve current file and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read HTML template helper
const readTemplate = (templateName) => {
    try {
        const templatePath = path.join(__dirname, '../emailTemplates', templateName);
        const template = fs.readFileSync(templatePath, 'utf8');
        console.log(`✅ Template "${templateName}" loaded.`);
        return template;
    } catch (error) {
        console.error("❌ Error reading template:", error);
        throw new Error(`Could not read template: ${templateName}`);
    }
};

// Verification email
export const sendVerificationEmail = async (email, verificationCode, name) => {
    const template = readTemplate('verificationEmail.html');
    const html = template.replace('{{verificationCode}}', verificationCode).replace('{{name}}', name);
    const subject = "Verify Your Email Address";
    const text = `Your verification code is: ${verificationCode}`;
    console.log(email,subject,text)
    await sendMail(email, subject, text, html);
};

// Welcome email
export const sendWelcomeEmail = async (email, name) => {
    const template = readTemplate('welcomeEmail.html');
    const html = template.replace('{{userName}}', name);
    const subject = "Welcome to FarmFlo!";
    const text = `Welcome, ${name}! Thanks for signing up.`;
    await sendMail(email, subject, text, html);
};

// OTP email
export const sendOTPEmail = async (email, otp) => {
    const template = readTemplate('otpEmail.html');
    const html = template.replace('{{otp}}', otp);
    const subject = "Your OTP Code";
    const text = `Your OTP is: ${otp}`;
    await sendMail(email, subject, text, html);
};

// Password reset request
export const sendResetEmail = async (email, name, resetLink) => {
    const template = readTemplate('resetEmail.html');
    const html = template.replace('{{resetLink}}', resetLink).replace('{{userName}}', name);
    const subject = "Password Reset Request";
    const text = `Reset your password using this link: ${resetLink}`;
    await sendMail(email, subject, text, html);
};

// Password reset success
export const sendResetSuccessEmail = async (email) => {
    const template = readTemplate('resetSuccessEmail.html');
    const subject = "Password Reset Successful";
    const text = "Your password has been reset successfully.";
    await sendMail(email, subject, text, template);
};

// Account deletion
export const sendDeleteEmail = async (email, userName) => {
    const template = readTemplate('deleteEmail.html');
    const html = template.replace('{{userName}}', userName);
    const subject = "Account Deletion Confirmation";
    const text = `Dear ${userName}, your account has been deleted.`;
    await sendMail(email, subject, text, html);
};
 
