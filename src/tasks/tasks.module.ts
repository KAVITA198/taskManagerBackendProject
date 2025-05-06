import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { AuthenticationMiddleware } from 'src/middleware/authentication.middleware';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TasksController],
  providers: [TasksService,PrismaService,NotificationsService,AuthService,UsersService,JwtService]
})
export class TasksModule {
   configure(consumer: MiddlewareConsumer) {
        consumer
          .apply(AuthenticationMiddleware)
          .forRoutes(
            TasksController,
          );
      }
}
