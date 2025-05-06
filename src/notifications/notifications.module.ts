import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { AuthenticationMiddleware } from 'src/middleware/authentication.middleware';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService,PrismaService,AuthService,UsersService,JwtService]
})
export class NotificationsModule {
     configure(consumer: MiddlewareConsumer) {
          consumer
            .apply(AuthenticationMiddleware)
            .forRoutes(
              NotificationsController,
            );
        }
}
