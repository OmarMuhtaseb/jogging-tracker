import {IsObjectId} from '@toptal/libs-db';
import {Transform} from 'class-transformer';
import {IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, Max, Min} from 'class-validator';
import {AppConstants} from '../constants';
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

export class ReportQuery {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Matches(JogsConstants.DATE_REGEX, {message: JogsConstants.ExceptionMessages.DATE_REGEX})
    from?: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Matches(JogsConstants.DATE_REGEX, {message: JogsConstants.ExceptionMessages.DATE_REGEX})
    to?: string;
}
