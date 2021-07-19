import {Module} from '@nestjs/common';
import {UsersModule} from '../users';
import {JogsController} from './controller';
import {HelpersService} from './helpers';
import {JogsRepository} from './repository';
import {JogsService} from './service';

@Module({
    imports: [UsersModule],
    controllers: [JogsController],
    providers: [JogsService, JogsRepository, HelpersService],
    exports: [JogsService],
})
export class JogsModule {
}
