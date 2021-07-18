import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {IsInt, IsOptional, Max, Min} from 'class-validator';
import {AppConstants} from './constants';

export class PaginationResponse {
    @ApiProperty()
    skip: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    total: number;
}

export class PaginationQuery {
    @Transform(limit => parseInt(limit.value))
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(AppConstants.PaginationMaxLimit)
    limit?: number = AppConstants.PaginationDefaultLimit;

    @Transform(skip => parseInt(skip.value))
    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number = 0;
}
