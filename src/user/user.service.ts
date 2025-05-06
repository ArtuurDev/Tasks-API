import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async createUser(data: Partial<User>) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                name: data.name, 
                image: data.image
            }
        })
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email
            }
        })
    }   

}
