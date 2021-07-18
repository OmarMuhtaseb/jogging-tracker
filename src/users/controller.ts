import {Body, Controller, Delete, Get, Param, Post, Put, Query} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';
import {AuthenticatedUser, AuthUser, Roles} from '@toptal/libs-auth';
import {PaginationQuery} from '../schema';
import {UserAuthResponse, UserListResponse, UserResponse} from './dto';
import {UsersMapper} from './mapper';
import {UserCreateRequest, UserLoginRequest, UserSignUpRequest, UserUpdateRequest} from './request';
import {UsersService} from './service';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private service: UsersService) {
    }

    @Post()
    @Roles('manager', 'admin')
    @ApiResponse({type: UserResponse})
    @ApiOperation({summary: 'Create User'})
    public async create(@Body() request: UserCreateRequest): Promise<UserResponse> {
        const user = await this.service.create(request);
        return {user: UsersMapper.toUserDto(user)};
    }

    @Roles()
    @Get('me')
    @ApiResponse({type: UserResponse})
    @ApiOperation({summary: 'Get Current User'})
    public async getCurrent(@AuthenticatedUser() authUser: AuthUser): Promise<UserResponse> {
        const user = await this.service.get(authUser.id);
        return {user: UsersMapper.toUserDto(user)};
    }

    @Get(':id')
    @Roles('manager', 'admin')
    @ApiResponse({type: UserResponse})
    @ApiOperation({summary: 'Get User'})
    public async get(@Param('id') id: string): Promise<UserResponse> {
        const user = await this.service.get(id);
        return {user: UsersMapper.toUserDto(user)};
    }

    @Roles()
    @Put('me')
    @ApiResponse({type: UserResponse})
    @ApiOperation({summary: 'Update Current User'})
    public async updateCurrent(@AuthenticatedUser() authUser: AuthUser, @Body() request: UserUpdateRequest): Promise<UserResponse> {
        const user = await this.service.update(authUser.id, request);
        return {user: UsersMapper.toUserDto(user)};
    }

    @Put(':id')
    @Roles('manager', 'admin')
    @ApiResponse({type: UserResponse})
    @ApiOperation({summary: 'Update User'})
    public async update(@Param('id') id: string, @Body() request: UserUpdateRequest): Promise<UserResponse> {
        const user = await this.service.update(id, request);
        return {user: UsersMapper.toUserDto(user)};
    }

    @Delete(':id')
    @Roles('manager', 'admin')
    @ApiResponse({type: UserResponse})
    @ApiOperation({summary: 'Delete User'})
    public async delete(@Param('id') id: string): Promise<UserResponse> {
        const user = await this.service.delete(id);
        return {user: UsersMapper.toUserDto(user)};
    }

    @Get()
    @Roles('manager', 'admin')
    @ApiResponse({type: UserListResponse})
    @ApiOperation({summary: 'List Users'})
    public async list(@Query() query: PaginationQuery): Promise<UserListResponse> {
        const {users, total} = await this.service.list(query);
        return {users: UsersMapper.toUserDtos(users), total, limit: query.limit, skip: query.skip};
    }

    @Post('sign-up')
    @ApiResponse({type: UserAuthResponse})
    @ApiOperation({summary: 'User Sign up'})
    public async signUp(@Body() request: UserSignUpRequest): Promise<UserAuthResponse> {
        const {user, token} = await this.service.signUp(request);
        return {user: UsersMapper.toUserDto(user), token};
    }

    @Post('login')
    @ApiResponse({type: UserAuthResponse})
    @ApiOperation({summary: 'User Login'})
    async login(@Body() request: UserLoginRequest): Promise<UserAuthResponse> {
        const {user, token} = await this.service.login(request.email, request.password);
        return {user: UsersMapper.toUserDto(user), token};
    }
}
