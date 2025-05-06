import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
    prisma: any;

    constructor(private jwtService: JwtService) {

    }

    async createToken(user: Partial<User>) {
        const payload = this.jwtService.sign({
            sub: user.id,
            email: user.email
        })

        return payload
    }

    async validateUser(payload: any) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        })

        if (!user) {
            throw new UnauthorizedException()
        }
        
        return user
    }

    async createRefreshToken(user: Partial<User>) {
        const payload = this.jwtService.sign({
            sub: user.id,
            email: user.email
        }, 
        {
            expiresIn: '7d'
        })

        return payload
}
}