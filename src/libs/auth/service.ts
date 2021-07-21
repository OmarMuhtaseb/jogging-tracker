import {Injectable} from '@nestjs/common';
import {AuthUser} from './schema';

@Injectable()
export class AuthService {
    public static hasRole(user: AuthUser, roles: string[]): boolean {
        return roles.includes(user.role);
    }
}
