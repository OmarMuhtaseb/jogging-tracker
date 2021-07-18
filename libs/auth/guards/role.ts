import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from '../service';

@Injectable()
export class RolesGuard extends AuthGuard('jwt') implements CanActivate {
    constructor(private reflector: Reflector) {
        super();
    }

    /**
     * User guard will check if the token has a user role
     * */
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        await super.canActivate(context);

        const request = context.switchToHttp().getRequest();
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!roles || roles.length == 0) {
            return true;
        }
        return AuthService.hasRole(request.user, roles);
    }
}
