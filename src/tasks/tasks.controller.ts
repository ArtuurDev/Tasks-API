import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

const zodSchema = z.object({
    title: z.string(),
    description: z.string(),
    dueDate: z.coerce.date(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGT']),
})

export class CreateTaskDto extends createZodDto(zodSchema) {}

@Controller()
export class TasksController {

    constructor(private readonly tasksService: TasksService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post('tasks')
    async createTasks(@Body() body: CreateTaskDto, @Req() req: Request)  {

        const user = req.user as User

        const { title, description, dueDate, priority } = body

        return this.tasksService.createTask({
            title,
            description,
            dueDate,
            priority,
            userId: user.id
        })
    }

    @Get('tasks')
    @UseGuards(AuthGuard('jwt'))
    async getTasks(@Req() req: Request) {
        const user = req.user as User
        return this.tasksService.findAllTasks(user.id)
    }

    @Get('tasks/:id')   
    @UseGuards(AuthGuard('jwt'))
    async getTaskById(@Req() req: Request, @Param('id') id: string) {
        const user = req.user as User
        return this.tasksService.findTasksById(user.id, id)
    }

    @Put('tasks/:id')
    @UseGuards(AuthGuard('jwt'))
    async updateTask(@Req() req: Request, @Param('id') id: string, @Body() body: CreateTaskDto) {
        const user = req.user as User
        return this.tasksService.updateTask(user.id, id, body)
    }

    @Delete('tasks/:id')
    @UseGuards(AuthGuard('jwt'))
    async deleteTask(@Req() req: Request, @Param('id') id: string) {
        const user = req.user as User
        return this.tasksService.deleteTask(user.id, id)
    }
}
