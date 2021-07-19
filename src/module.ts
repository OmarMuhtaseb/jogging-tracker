import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AuthModule} from '@toptal/libs-auth';
import {AppController} from './controller';
import {JogsModule} from './jogs';
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
        JogsModule,
    ],
    controllers: [AppController],
})
export class AppModule {
}
