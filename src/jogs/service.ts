import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {PaginationQuery} from '../types';
import {UsersService} from '../users';
import {JogsConstants} from './constants';
import {HelpersService} from './helpers';
import {JogsRepository} from './repository';
import {JogRequest} from './request';
import {Jog} from './schema';

@Injectable()
export class JogsService {
    constructor(private repository: JogsRepository,
                private usersService: UsersService,
                private helpersService: HelpersService) {
    }

    public async create(data: JogRequest): Promise<Jog> {
        const userExists = await this.usersService.exists(data.user);
        if (!userExists) {
            throw new BadRequestException(JogsConstants.ExceptionMessages.USER_NOT_FOUND);
        }

        const weather = await this.helpersService.getWeather(data.location, data.date);
        return await this.repository.create({...data, weather: weather, date: data.date});
    }

    public async get(id: string, userId: string): Promise<Jog> {
        const jog = await this.repository.findById(id);

        if (!!userId && jog.user !== userId) {
            throw new UnauthorizedException(JogsConstants.ExceptionMessages.FORBIDDEN_RESOURCE);
        }

        return jog;
    }

    public async update(id: string, data: JogRequest): Promise<Jog> {
        const weather = await this.helpersService.getWeather(data.location, data.date);
        return await this.repository.updateById(id, {...data, weather: weather, date: data.date});
    }

    public async delete(id: string, userId): Promise<Jog> {
        const jog = await this.repository.deleteById(id);

        if (!!userId && jog.user !== userId) {
            throw new UnauthorizedException(JogsConstants.ExceptionMessages.FORBIDDEN_RESOURCE);
        }

        return jog;
    }

    public async list(query: PaginationQuery): Promise<{jogs: Jog[], total: number}> {
        const {data, total} = await this.repository.list(query);
        return {
            jogs: data,
            total,
        };
    }
}
