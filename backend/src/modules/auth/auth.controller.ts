import { BadRequestException, Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UserPayload } from '../../shared/interfaces/user-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { UserData } from './interfaces/user-data.interface';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

    @Post('/auth')
    async auth(@Body() authDto: AuthDto) {
        const document = await this.authService.attempAuth(authDto)
        if (!document) throw new BadRequestException();

        const payload: UserPayload = {
            _id: document.id,
            username: document.username
        }

        const token: string = await this.jwtService.signAsync(payload, {
            expiresIn: '7d'
        })

        return {
            token
        }
    }

    @Get('/info')
    @UseGuards(AuthGuard)
    async getUserInfo(@Request() request: any): Promise<UserData> {
        const userId = request.user._id
        const userDocument = await this.usersService.getUserById(userId)

        return {
            _id: userDocument.id,
            username: userDocument.username
        }
    }
}