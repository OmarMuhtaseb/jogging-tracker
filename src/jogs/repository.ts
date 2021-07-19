import {Injectable} from '@nestjs/common';
import {Repository} from '@toptal/libs-db';
import {Jog, JogSchema} from './schema';

@Injectable()
export class JogsRepository extends Repository<Jog> {
    constructor() {
        super('Jog', JogSchema);
    }
}
