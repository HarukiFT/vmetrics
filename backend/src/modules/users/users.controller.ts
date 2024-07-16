import { BadRequestException, Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('/isexist')
    async isExist(@Query('username') username: string) {
        return await this.usersService.isUserExist(username)
    }

    @Post('/register')
    async createUser(@Body() createUserDto: CreateUserDto) {
        const isExist = await this.usersService.isUserExist(createUserDto.username)
        if (isExist) throw new BadRequestException();

        await this.usersService.createUser(createUserDto)
    }
}
