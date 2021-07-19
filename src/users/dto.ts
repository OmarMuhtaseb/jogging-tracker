import {PaginationResponse} from '../schema';

export class Dto {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
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
