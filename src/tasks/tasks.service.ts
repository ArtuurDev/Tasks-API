import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CacheRepository } from 'src/cache/cache-repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cacheRepository: CacheRepository
    ) {

    }

    async createTask(data: Prisma.TaskUncheckedCreateInput) {

        
        return this.prismaService.task.create({
            data
        })
    }   

    async findAllTasks(userId: string) {
        
        const cachedTasks = await this.cacheRepository.get(`tasks:${userId}`)

        if (cachedTasks) {
            console.log('Retornando do cache')
            return {cached: 
                JSON.parse(cachedTasks)
            }
        
        }

        const tasks = await this.prismaService.task.findMany({
            where: {
                userId
            }
        })

        await this.cacheRepository.set(`tasks:${userId}`, JSON.stringify(tasks))

        return tasks
    }

    async findTasksById(userId: string, id: string) {
        return this.prismaService.task.findUnique({
            where: { id, userId }
        })
    }
    
    async updateTask(userId: string, id: string, data: Prisma.TaskUpdateInput) {
        return this.prismaService.task.update({
            where: { id, userId },
            data
        })
    }               

    async deleteTask(userId: string, id: string) {
        return this.prismaService.task.delete({
            where: { id, userId }
        })
    }       
    

}
