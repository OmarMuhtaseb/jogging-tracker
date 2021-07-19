import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Role} from '@toptal/libs-auth';
import {AuthService} from '../service';

@Injectable()
export class UserGuard implements CanActivate {
    /**
     * User guard will check if the token has a user role
     * */
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        if (!AuthService.hasRole(request.user, [Role.user])) {
            return true;
        }

        const requestedUserId = request.body.user;
        return request.user.id === requestedUserId;
    }
}
