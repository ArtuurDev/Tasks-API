import { Controller, Get, Req, UseGuards, UnauthorizedException, InternalServerErrorException, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';


interface GoogleUser {
    email: string;
    name: string;
    image: string;
}

@Controller()
export class UserController {

    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService
    ) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {

    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async goolgeAuthCallback(@Req() req: Request, @Res() res: Response) {
        
        const user = req.user as GoogleUser

        
        try {
            const userExists = await this.userService.findUserByEmail(user.email)
            if(!userExists) {
                const newUser = await this.userService.createUser({
                    email: user.email,
                    name: user.name,
                    image: user.image
                })
    
                const token = await this.authService.createToken(newUser)
                const refreshToken = await this.authService.createRefreshToken({
                    email: newUser.email,
                    id: newUser.id
                })
    
                return res.send({
                    message: 'Usuário criado com sucesso, obrigado por se cadastrar!',
                    access_token: token,
                    refresh_token: refreshToken
                })
            }
    
            const token = await this.authService.createToken(userExists) 
            const refreshToken = await this.authService.createRefreshToken(userExists)
    
            return res.send({
                message: 'Usuário logado com sucesso!',
                access_token: token,
                refresh_token: refreshToken
            })
        } catch (error) {
            throw new InternalServerErrorException(error)
        }

    }
}
