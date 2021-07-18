import {Injectable} from '@nestjs/common';
import {Repository} from '@toptal/libs-db';
import {User, UserSchema} from './schema';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor() {
        super('User', UserSchema, [{fields: {email: 1}, options: {unique: true}}]);
    }
}
