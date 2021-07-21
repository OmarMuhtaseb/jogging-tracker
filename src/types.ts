import {Transform} from 'class-transformer';
import {IsInt, IsOptional, Max, Min} from 'class-validator';
import {AppConstants} from './constants';

export class PaginationResponse {
    skip: number;
    limit: number;
    total: number;
}

export class PaginationQuery {
    @Transform(limit => parseInt(limit.value))
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(AppConstants.PaginationMaxLimit)
    limit?: number;

    @Transform(skip => parseInt(skip.value))
    @IsOptional()
    @IsInt()
    @Min(0)
    skip?: number;
}
