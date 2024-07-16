import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { UserPayload } from '../../shared/interfaces/user-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

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
}