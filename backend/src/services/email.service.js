const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Configure transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'apikey',
        pass: process.env.SMTP_PASS || process.env.SENDGRID_API_KEY
    }
});

/**
 * Send email verification OTP
 */
const sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@pamiloai.com',
        to: email,
        subject: 'Verify your Pamilo AI account',
        html: `
            <h1>Welcome to Pamilo AI</h1>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info(`Verification email sent to ${email}`);
    } catch (error) {
        logger.error(`Error sending verification email: ${error.message}`);
        throw error;
    }
};

/**
 * Send welcome email
 */
const sendWelcomeEmail = async (user, business) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@pamiloai.com',
        to: user.email,
        subject: 'Welcome to Pamilo AI!',
        html: `
            <h1>Hi ${user.firstName},</h1>
            <p>Welcome to Pamilo AI! Your business <strong>${business.businessName}</strong> is now ready to use our AI-powered support.</p>
            <p>Get started by uploading your documents to the knowledge base.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(`Error sending welcome email: ${error.message}`);
    }
};

/**
 * Send ticket assignment notification
 */
const sendTicketAssigned = async (user, ticket) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@pamiloai.com',
        to: user.email,
        subject: `Ticket Assigned: ${ticket.ticketNumber}`,
        html: `
            <p>A new ticket has been assigned to you.</p>
            <p><strong>Ticket #:</strong> ${ticket.ticketNumber}</p>
            <p><strong>Priority:</strong> ${ticket.priority}</p>
            <p>Please check your dashboard for details.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        logger.error(`Error sending ticket assignment email: ${error.message}`);
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendTicketAssigned
};
