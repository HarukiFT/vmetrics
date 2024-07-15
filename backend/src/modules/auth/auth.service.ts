import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async attempAuth(authDto: AuthDto) {
        const document = await this.usersService.getUserByUsername(authDto.username)
        if (!document) return null;

        const result = await compare(authDto.password, document.password)
        
        return (result && document)
    }
}
