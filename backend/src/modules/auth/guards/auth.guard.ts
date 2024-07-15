import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserPayload } from "../../../shared/interfaces/user-payload.interface";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const request = context.switchToHttp().getRequest()

        const authData: string[] = (request.headers['authorization'] ?? '').split(' ')
        if (authData.length !== 2 || authData[0] !== 'Bearer') throw new UnauthorizedException();
        try {
            const payload = await this.jwtService.verifyAsync(authData[1]) as UserPayload
            request.user = payload

            return true
        } catch (err) {
            throw new UnauthorizedException()
        }
    }
}