import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prismaService/prismaService.service';
import { AuthenticationMiddleware } from 'src/middleware/authentication.middleware';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  controllers: [UsersController],
  providers: [UsersService,PrismaService,AuthService,JwtService]
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .forRoutes(
        UsersController,
      );
  }
}
