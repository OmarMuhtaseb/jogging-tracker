export class UsersConstants {
    public static PasswordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}:;<>,~_+-=|]).{8,32}$/;
    public static ExceptionMessages = {
        PASSWORD_WEAK: 'Password must have a length of 8 with A-Z, a-z, 0-9, and at least one special character',
        INVALID_CREDENTIALS: 'Invalid credentials',
        USER_EXISTS: 'Email already exists',
    };
    public static TokenExpiry = '30m';
}
