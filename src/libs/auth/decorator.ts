import {createParamDecorator, ExecutionContext, SetMetadata} from '@nestjs/common';
import {AuthUser} from './schema';

export const AuthenticatedUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
