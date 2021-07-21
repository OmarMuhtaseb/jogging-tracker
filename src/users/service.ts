import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {AuthUser, Role} from '@toptal/libs-auth';
import {compareSync, hashSync} from 'bcrypt';
import {PaginationQuery} from '../types';
import {UsersConstants} from './constants';
import {UsersRepository} from './repository';
import {User} from './schema';

@Injectable()
export class UsersService {
    constructor(private repository: UsersRepository,
                private jwtService: JwtService) {
    }

    public async create(data: {email: string; name: string; password: string, role?: Role}): Promise<User> {
        const userExists = await this.emailExists(data.email);
        if (userExists) {
            throw new ConflictException(UsersConstants.ExceptionMessages.USER_EXISTS);
        }
        const hashedPassword = UsersService.hashPassword(data.password);
        return await this.repository.create({
            role: data.role || Role.user,
            email: data.email,
            name: data.name,
            password: hashedPassword,
        });
    }

    public async get(id: string): Promise<User> {
        return await this.repository.findById(id);
    }

    public async exists(id: string): Promise<boolean> {
        return await this.repository.existsById(id);
    }

    public async update(id: string, data: {name: string, email: string}): Promise<User> {
        return await this.repository.updateById(id, {name: data.name, email: data.email});
    }

    public async delete(id: string): Promise<User> {
        return await this.repository.deleteById(id);
    }

    public async list(query: PaginationQuery): Promise<{users: User[], total: number}> {
        const {data, total} = await this.repository.list(query);
        return {
            users: data,
            total,
        };
    }

    public async signUp(data: {email: string, name: string, password: string}): Promise<{user: User, token: string}> {
        const user = await this.create(data);
        const token = this.generateToken(user);
        return {user, token};
    }

    public async login(email: string, password: string) {
        const user = await this.repository.findOne({email});
        if (!user) {
            throw new UnauthorizedException(UsersConstants.ExceptionMessages.INVALID_CREDENTIALS);
        }

        const hashedPassword = UsersService.hashPassword(password);
        const passwordMatch = UsersService.passwordsMatch(user.password, hashedPassword);

        if (passwordMatch) {
            throw new UnauthorizedException(UsersConstants.ExceptionMessages.INVALID_CREDENTIALS);
        }

        const token = this.generateToken(user);
        return {user, token};
    }

    private async emailExists(email: string): Promise<boolean> {
        return await this.repository.exists({email: email});
    }

    private generateToken(user: User): string {
        const userAttr: AuthUser = {
            id: user._id,
            email: user.email,
            role: user.role,
        };

        return this.jwtService.sign(userAttr);
    }

    private static hashPassword(password: string): string {
        return hashSync(password, 10);
    }

    private static passwordsMatch(password: string, enteredPassword): boolean {
        return compareSync(enteredPassword, password);
    }
}
