import {Dto} from './dto';
import {User} from './schema';

export class UsersMapper {
    public static toUserDto(user: User): Dto {
        return {
            id: user._id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
        };
    }

    public static toUserDtos(users: User[]): Dto[] {
        return users.map(user => this.toUserDto(user));
    }
}
