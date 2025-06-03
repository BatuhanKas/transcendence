import {User} from "../entities/user";
import Result from "../bean/result";
import {StatusCodes} from "http-status-codes";
import bcrypt from 'bcryptjs';
import {findUserByEmail, findUserByUuid, updateUserRepository} from "../repositories/repository";
import validator from "validator";

export async function updateUserService(requestUser: Partial<User>) {
    const user = await findUserByUuid(requestUser.uuid!);

    if (!user) {
        return new Result(StatusCodes.NOT_FOUND, null, "User not found");
    }

    const fieldsToUpdate: Partial<User> = {};

    if (requestUser.email !== undefined) {
        if (!validator.isEmail(requestUser.email)) {
            return new Result(StatusCodes.BAD_REQUEST, null, 'Invalid email format');
        }
        if (requestUser.email !== user.email) {
            const existingUser = await findUserByEmail(requestUser.email);
            if (existingUser) {
                return new Result(StatusCodes.CONFLICT, null, 'Email is already in use');
            }
            fieldsToUpdate.email = requestUser.email;
        }
    }

    if (requestUser.username !== undefined) {
        if (requestUser.username.length < 3 || requestUser.username.length > 20) {
            return new Result(StatusCodes.BAD_REQUEST, null, 'Username must be between 3 and 20 characters');
        }
        if (requestUser.username !== user.username) {
            fieldsToUpdate.username = requestUser.username;
        }
    }

    if (requestUser.password !== undefined) {
        if (requestUser.password.length < 6 || requestUser.password.length > 25) {
            return new Result(StatusCodes.BAD_REQUEST, null, 'Password must be 6-25 characters long');
        }
        const isSame = await bcrypt.compare(requestUser.password, user.password);
        if (!isSame) {
            fieldsToUpdate.password = await bcrypt.hash(requestUser.password, 10);
        }
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
        return new Result(StatusCodes.OK, null, "No changes made to the user");
    }

    fieldsToUpdate.uuid = requestUser.uuid!;

    await updateUserRepository(fieldsToUpdate);
    const updatedUser = await findUserByUuid(requestUser.uuid!);
    return new Result(StatusCodes.OK, updatedUser, "User updated successfully");
}