import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { AuthenticationMiddleware } from 'src/middleware/authentication.middleware';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService,PrismaService,AuthService,UsersService,JwtService]
})
export class DashboardModule {
   configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthenticationMiddleware)
        .forRoutes(
          DashboardController,
        );
    }
}
