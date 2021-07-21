import {IsObjectId} from '@toptal/libs-db';
import {IsNotEmpty, IsNumber, IsPositive, IsString, Matches} from 'class-validator';
import {JogsConstants} from './constants';

export class PathParams {
    @IsObjectId()
    id: string;
}

export class JogRequest {
    @IsString()
    @IsNotEmpty()
    user: string;

    @IsNumber()
    @IsPositive()
    distance: number;

    @IsNumber()
    @IsPositive()
    time: number;

    @IsString()
    @IsNotEmpty()
    @Matches(JogsConstants.DATE_REGEX, {message: JogsConstants.ExceptionMessages.DATE_REGEX})
    date: string;

    @IsString()
    @IsNotEmpty()
    location: string;
}
