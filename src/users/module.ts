import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {UsersConstants} from './constants';
import {UsersController} from './controller';
import {UsersRepository} from './repository';
import {UsersService} from './service';

@Module({
    imports: [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {expiresIn: UsersConstants.TokenExpiry},
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService],
})
export class UsersModule {
}
