import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import Result from "../bean/result";
import {StatusCodes} from "http-status-codes";
import {AuthResponseMessages} from "../constants/auth.response.messages";
import validator from "validator";
import {AuthRepository} from "../repositories/repository";

dotenv.config();

const emailCache = new Map<string, string>();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "batuhannkas@gmail.com",
        pass: "ylqy clrj xmfe oftu"
    }
});

const generateToken = () => {
    return Math.random().toString(36).substring(2, 15);
}

const sendMail = async (to: string) => {
    if (to.length < 5 || to.length > 50)
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.EMAIL_LENGTH_INVALID);

    if (!validator.isEmail(to))
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.INVALID_EMAIL_FORMAT);

    const existingUser = await AuthRepository.findUserByEmail(to);
    if (!existingUser)
        return new Result(StatusCodes.CONFLICT, null, AuthResponseMessages.USER_NOT_FOUND);

    if (existingUser.verified) {
        return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.USER_ALREADY_VERIFIED);
    }

    const token = generateToken();
    const verifyLink = `http://auth.transendence.com/api/auth/verify?token=${token}`;

    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject: 'Email Verification',
        html: `
            <h1>Welcome to Verification Service</h1>
            <p>The mail expires in 10 minutes</p>
            <p>To complete your registration, please verify your email address by clicking the link below;</p>
            <p><a href="${verifyLink}">Click here to Verify Email</a></p>
        `
    };

    if (emailCache.has(token))
        emailCache.delete(token);

    try {
        // Store the token in a cache with a 10-minute expiration
        emailCache.set(token, to);
        setTimeout(() => {
            emailCache.delete(token);
        }, 10 * 60 * 1000);

        // await transporter.sendMail(mailOptions);
        return new Result(StatusCodes.OK, null, AuthResponseMessages.EMAIL_SENT_SUCCESSFULLY);
    } catch (error) {
        console.log('Error sending email:', error);
        return new Result(StatusCodes.INTERNAL_SERVER_ERROR, null, AuthResponseMessages.EMAIL_SEND_FAILED);
    }
}

export const MailService = {
    sendMail,
    emailCache
}