export enum AuthResponseMessages {
    // Authorization / JWT
    AUTH_HEADER_MISSING_OR_INVALID = "Authorization header is missing or invalid",
    TOKEN_MISSING = "Token is missing",
    INVALID_TOKEN = "Invalid token",
    TOKEN_VALID = "Token is valid",

    // Login
    EMAIL_AND_PASSWORD_REQUIRED = "Email and password are required",
    EMAIL_LENGTH_INVALID = "Email must be between 5 and 50 characters long",
    INVALID_EMAIL_FORMAT = "Invalid email format",
    INVALID_EMAIL = "Invalid email adress!",
    INVALID_PASSWORD = "Invalid password!",
    LOGIN_SUCCESS = "Login successful",

    // Register
    REGISTRATION_FIELDS_REQUIRED = "Username, email, and password are required",
    USERNAME_NOT_ALPHANUMERIC = "Username must be alphanumeric",
    USERNAME_LENGTH_INVALID = "Username must be between 3 and 20 characters long",
    PASSWORD_LENGTH_INVALID = "Password must be at least 6 characters long and at most 25 characters long",
    USERNAME_EXISTS = "usernameExists",
    EMAIL_EXISTS = "emailExists",
    USER_REGISTERED = "User registered successfully",

    // Update User
    USER_NOT_FOUND = "User not found",
    EMAIL_ALREADY_IN_USE = "Email is already in use",
    USER_UPDATED = "User updated successfully",
    NO_CHANGES_MADE = "No changes made to the user",
}