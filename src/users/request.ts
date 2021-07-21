import {Role} from '@toptal/libs-auth';
import {IsObjectId} from '@toptal/libs-db';
import {IsEmail, IsEnum, IsNotEmpty, IsString, Matches} from 'class-validator';
import {UsersConstants} from './constants';

export class PathParams {
    @IsObjectId()
    id: string;
}

export class UserSignUpRequest {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    @Matches(UsersConstants.PasswordRegex, {message: UsersConstants.ExceptionMessages.PASSWORD_WEAK})
    password: string;
}

export class UserLoginRequest {
    @IsEmail()
    email?: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UserCreateRequest extends UserSignUpRequest {
    @IsEnum(Role)
    role: Role;
}

export class UserUpdateRequest {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;
}
