import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {AuthModule, RolesGuard} from '@toptal/libs-auth';
import {AppController} from './controller';
import {UsersModule} from './users';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        AuthModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
            }),
            inject: [ConfigService],
        }),
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {
}
