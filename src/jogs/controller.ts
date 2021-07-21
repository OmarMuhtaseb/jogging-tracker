import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AuthenticatedUser, AuthUser, Role, Roles, RolesGuard, UserGuard} from '@toptal/libs-auth';
import {PaginationQuery} from '../types';
import {JogListResponse, JogResponse} from './dto';
import {JogsMapper} from './mapper';
import {JogRequest, PathParams} from './request';
import {JogsService} from './service';

@ApiBearerAuth()
@ApiTags('Jogs')
@UseGuards(RolesGuard)
@Controller('jogs')
export class JogsController {
    constructor(private service: JogsService) {
    }

    @Post()
    @UseGuards(UserGuard)
    @Roles('user', 'admin')
    @ApiResponse({type: JogResponse})
    @ApiOperation({summary: 'Create Jog'})
    public async create(@Body() request: JogRequest): Promise<JogResponse> {
        const jog = await this.service.create(request);
        return {jog: JogsMapper.toJogDto(jog)};
    }

    @Get(':id')
    @Roles('user', 'admin')
    @ApiResponse({type: JogResponse})
    @ApiOperation({summary: 'Get User'})
    public async get(@AuthenticatedUser() user: AuthUser, @Param() params: PathParams): Promise<JogResponse> {
        const userId = user.role === Role.user ? user.id : '';
        const jog = await this.service.get(params.id, userId);
        return {jog: JogsMapper.toJogDto(jog)};
    }

    @Put(':id')
    @UseGuards(UserGuard)
    @Roles('user', 'admin')
    @ApiResponse({type: JogResponse})
    @ApiOperation({summary: 'Update Jog'})
    public async update(@Param() params: PathParams, @Body() request: JogRequest): Promise<JogResponse> {
        const jog = await this.service.update(params.id, request);
        return {jog: JogsMapper.toJogDto(jog)};
    }

    @Delete(':id')
    @Roles('user', 'admin')
    @ApiResponse({type: JogResponse})
    @ApiOperation({summary: 'Delete Jog'})
    public async delete(@AuthenticatedUser() user: AuthUser, @Param() params: PathParams): Promise<JogResponse> {
        const userId = user.role === Role.user ? user.id : '';
        const jog = await this.service.delete(params.id, userId);
        return {jog: JogsMapper.toJogDto(jog)};
    }

    @Get()
    @Roles('user', 'admin')
    @ApiResponse({type: JogListResponse})
    @ApiOperation({summary: 'List Jogs'})
    public async list(@Query() query: PaginationQuery): Promise<JogListResponse> {
        const {jogs, total} = await this.service.list(query);
        return {jogs: JogsMapper.toJogDtos(jogs), total, limit: query.limit, skip: query.skip};
    }
}
