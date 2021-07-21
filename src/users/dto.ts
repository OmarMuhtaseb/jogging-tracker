import {PaginationResponse} from '../types';

export class Dto {
    id: string;
    email: string;
    name: string;
    role: string;
}

export class UserResponse {
    user: Dto;
}

export class UserAuthResponse extends UserResponse {
    token: string;
}

export class UserListResponse extends PaginationResponse {
    users: Dto[];
}
