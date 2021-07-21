import {PaginationResponse} from '../types';

export class JogDto {
    id: string;
    user: string;
    distance: number;
    date: Date;
    time: number;
    location: string;
    weather: string;
    createdAt: Date;
}

export class JogResponse {
    jog: JogDto;
}

export class JogListResponse extends PaginationResponse {
    jogs: JogDto[];
}
