import 'dotenv/config'
import nodemailer from 'nodemailer';
import Result from "../bean/result";
import {StatusCodes} from "http-status-codes";
import {AuthResponseMessages} from "../constants/auth.response.messages";
import validator from "validator";
import {AuthRepository} from "../repositories/repository";
import {User} from "../entities/user";

const emailCache = new Map<string, string>();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

const generateToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }

    return token;
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

    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject: 'Email Verification',
        html: `
            <h1>Welcome to Verification Service</h1>
            <p>The mail expires in 10 minutes</p>
            <p>To complete your registration, please use the code to activate your account;</p>
            <p> Code: <strong>${token}</strong></p>
        `
    };

    if (emailCache.has(token))
        emailCache.delete(token);

    try {
        // Store the token in a cache with a 10-minute expiration
        emailCache.set(token, to);
        setTimeout(() => {
            const email = emailCache.get(token);
            if (!email)
                return new Result(StatusCodes.NOT_FOUND, null, AuthResponseMessages.EMAIL_SEND_FAILED);

            const user: Promise<User | null> = AuthRepository.findUserByEmail(email);
            user.then(u => {
                if (u && !u.verified)
                    AuthRepository.deleteUserByEmail(email);
            });
            emailCache.delete(token);
        }, 10 * 60 * 1000);

        await transporter.sendMail(mailOptions);
        return new Result(StatusCodes.OK, null, AuthResponseMessages.EMAIL_SENT_SUCCESSFULLY);
    } catch (error) {
        console.log("Error sending email:", error);
        return new Result(StatusCodes.INTERNAL_SERVER_ERROR, null, AuthResponseMessages.EMAIL_SEND_FAILED);
    }
}

export const MailService = {
    sendMail,
    emailCache
}