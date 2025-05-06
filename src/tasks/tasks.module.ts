import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RedisModule } from 'src/cache/redis/redis.module';
import { CacheRepository } from 'src/cache/cache-repository';
import { RedisCacheRepository } from 'src/cache/redis/redis-cache-repository';
@Module({
  imports: [PrismaModule, RedisModule],
  providers: [TasksService, {
    provide: CacheRepository,
    useClass: RedisCacheRepository
  }],
  controllers: [TasksController]
})
export class TasksModule {}
