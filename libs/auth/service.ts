import {Injectable} from '@nestjs/common';
import {AuthUser} from './schema';

@Injectable()
export class AuthService {
    public static hasRole(user: AuthUser, roles: string[]): boolean {
        for (const role of user.roles) {
            if (roles.includes(role)) {
                return true;
            }
        }
        return false;
    }
}
