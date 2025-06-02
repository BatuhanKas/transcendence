import {User} from "../entities/user";
import Result from "../bean/result";
import {StatusCodes} from "http-status-codes";
import bcrypt from 'bcryptjs';
import {findUserByEmail, findUserByUuid, updateUserRepository} from "../repositories/repository";
import validator from "validator";

export async function updateUserService(requestUser: User) {
    const user = await findUserByUuid(requestUser.uuid);

    let flag = false;

    if (!user) {
        return new Result(StatusCodes.NOT_FOUND, null, "User not found");
    }

    if (!requestUser.username || !requestUser.email || !requestUser.password) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Username, email, and password are required');
    }

    if (requestUser.username.length < 3 || requestUser.username.length > 20) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Username must be between 3 and 20 characters long');
    }

    if (requestUser.password.length < 6 || requestUser.password.length > 25) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Password must be at least 6 characters long');
    }

    if (!validator.isEmail(requestUser.email)) {
        return new Result(StatusCodes.BAD_REQUEST, null, 'Invalid email format');
    }

    if (user.email !== requestUser.email) {
        const existingUser = await findUserByEmail(requestUser.email);
        if (existingUser) {
            return new Result(StatusCodes.CONFLICT, null, 'Email is already in use');
        }
        user.email = requestUser.email;
        flag = true;
    }

    if (user.username !== requestUser.username) {
        user.username = requestUser.username;
        flag = true;
    }

    const isMismatch = await bcrypt.compare(requestUser.password, user.password);
    if (!isMismatch) {
        user.password = await bcrypt.hash(requestUser.password, 10);
        flag = true;
    }

    if (!flag) {
        return new Result(StatusCodes.OK, null, "No changes made to the user");
    }
    await updateUserRepository(user);
    return new Result(StatusCodes.OK, user, "User updated successfully");
}