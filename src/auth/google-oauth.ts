import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Env } from "src/config/env";

@Injectable()
export class GoogleOauth extends PassportStrategy(Strategy, 'google') {
    constructor(config: ConfigService<Env>) {
        super({
            clientID: config.get('GOOGLE_CLIENT_ID'),
            clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: 'http://localhost:3000/google/callback',
            scope: ['email', 'profile'],
        })
    }

    async validate(
        accessToken: string, 
        refreshToken: string, 
        profile: any, 
        done: VerifyCallback) {
            const { name, emails, photos } = profile
            console.log(profile)
            const user = {
                email: emails[0].value,
                name: name.givenName,
                image: photos[0].value
            }

            done(null, user)
        }

}
