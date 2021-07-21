import {Inject, Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {AUTH_MODULE_OPTIONS} from './constants';
import {AuthOptions} from './interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(AUTH_MODULE_OPTIONS) private options: AuthOptions) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: options.secret,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}
