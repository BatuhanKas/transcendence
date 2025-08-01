import {User} from "../entities/user";
import Result from "../bean/result";
import {StatusCodes} from "http-status-codes";
import bcrypt from 'bcryptjs';
import validator from "validator";
import {AuthResponseMessages} from "../constants/auth.response.messages";
const AuthRepository = require('../repositories/repository');

/**
 * Service to update user information.
 * @param requestUser
 */
async function updateUserService(requestUser: Partial<User>) {
    const user = await AuthRepository.findUserByUuid(requestUser.uuid!);

    if (!user) {
        return new Result(StatusCodes.NOT_FOUND, null, AuthResponseMessages.USER_NOT_FOUND);
    }

    const fieldsToUpdate: Partial<User> = {};

    if (requestUser.email !== undefined) {
        if (!validator.isEmail(requestUser.email)) {
            return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.INVALID_EMAIL_FORMAT);
        }
        if (requestUser.email !== user.email) {
            const existingUser = await AuthRepository.findUserByEmail(requestUser.email);
            if (existingUser) {
                return new Result(StatusCodes.CONFLICT, null, AuthResponseMessages.EMAIL_ALREADY_IN_USE);
            }
            fieldsToUpdate.email = requestUser.email;
        }
    }

    if (requestUser.username !== undefined) {
        if (requestUser.username.length < 3 || requestUser.username.length > 20) {
            return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.USERNAME_LENGTH_INVALID);
        }
        if (requestUser.username !== user.username) {
            fieldsToUpdate.username = requestUser.username;
        }
    }

    if (requestUser.password !== undefined) {
        if (requestUser.password.length < 6 || requestUser.password.length > 25) {
            return new Result(StatusCodes.BAD_REQUEST, null, AuthResponseMessages.PASSWORD_LENGTH_INVALID);
        }
        const isSame = await bcrypt.compare(requestUser.password, user.password);
        if (!isSame) {
            fieldsToUpdate.password = await bcrypt.hash(requestUser.password, 10);
        }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return new Result(StatusCodes.OK, null, AuthResponseMessages.NO_CHANGES_MADE);
    }

    fieldsToUpdate.uuid = requestUser.uuid!;

    await AuthRepository.updateUserRepository(fieldsToUpdate);
    const updatedUser = await AuthRepository.findUserByUuid(requestUser.uuid!);
    return new Result(StatusCodes.OK, updatedUser, AuthResponseMessages.USER_UPDATED);
}

module.exports = {
    updateUserService
}