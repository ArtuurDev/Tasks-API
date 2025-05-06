import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/config/env';
import { PassportModule } from '@nestjs/passport';
import { GoogleOauth } from './google-oauth';
import { JwtStrategy } from './passport-jwt';

@Module({
  imports: [JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService<Env>) => {
      const secret = config.get('JWT_SECRET');
      return {
        secret,
        signOptions: { expiresIn: '15m' }
      };
    } 
  }), PassportModule.register({ defaultStrategy: 'google' })
],
    providers: [
    AuthService,
    GoogleOauth,
    JwtStrategy,
    GoogleOauth
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
