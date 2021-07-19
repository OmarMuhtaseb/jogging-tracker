import {IsDateString, IsNotEmpty, IsNumber, IsPositive, IsString} from 'class-validator';

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

    @IsDateString()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    location: string;
}
