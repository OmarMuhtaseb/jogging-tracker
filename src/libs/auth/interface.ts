import {ModuleMetadata, Type} from '@nestjs/common/interfaces';

export interface AuthOptions {
    secret: string,
}

export interface AuthOptionsFactory {
    createAuthOptions(): Promise<AuthOptions> | AuthOptions;
}

export interface AuthAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    useExisting?: Type<AuthOptionsFactory>;
    useClass: Type<AuthOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<AuthOptions> | AuthOptions;
    inject?: any[];
}
