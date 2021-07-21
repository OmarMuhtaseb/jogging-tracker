import {DynamicModule, Global, Module, Provider} from '@nestjs/common';
import {AuthAsyncOptions, AuthOptions, AuthOptionsFactory} from './interface';
import {AUTH_MODULE_ID, AUTH_MODULE_OPTIONS} from './constants';
import {AuthService} from './service';
import {v4 as uuid} from 'uuid';
import {JwtStrategy} from './strategy';

@Global()
@Module({
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {

    static register(options: AuthOptions): DynamicModule {
        const moduleOptions = {
            provide: AUTH_MODULE_OPTIONS,
            useValue: options || {},
        };
        const provider = {
            provide: 'AuthService',
            useFactory: () => new AuthService(),
        };

        return {
            module: AuthModule,
            providers: [moduleOptions, provider],
        };
    }

    static registerAsync(options: AuthAsyncOptions): DynamicModule {
        const provider = {
            provide: (options: AuthOptions) => 'AuthService',
            useFactory: () => new AuthService(),
            inject: [AUTH_MODULE_OPTIONS],
        };

        const moduleOptions = {
            provide: AUTH_MODULE_ID,
            useValue: uuid(),
        };

        const asyncProviders = this.createAuthAsyncProvider(options);
        return {
            module: AuthModule,
            imports: options.imports || [],
            providers: [
                ...asyncProviders,
                moduleOptions,
                provider,
            ],
        };
    }

    private static createAuthAsyncProvider(options: AuthAsyncOptions): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }

    private static createAsyncOptionsProvider(options: AuthAsyncOptions): Provider {
        if (options.useFactory) {
            return {
                provide: AUTH_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        return {
            provide: AUTH_MODULE_OPTIONS,
            useFactory: async (optionsFactor: AuthOptionsFactory) =>
                await optionsFactor.createAuthOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
}
