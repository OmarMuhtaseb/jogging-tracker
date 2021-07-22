import {PaginationResponse} from '../types';
import {WeeklyReport} from './schema';

export class JogDto {
    id: string;
    user: string;
    distance: number;
    date: string;
    time: number;
    location: string;
    weather: string;
}

export class JogResponse {
    jog: JogDto;
}

export class JogListResponse extends PaginationResponse {
    jogs: JogDto[];
}

export class JogReportResponse {
    data: WeeklyReport[];
}
