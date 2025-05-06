import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prismaService/prismaService.service';
// import { PrismaService } from 'libs/common/src/prisma/prisma.service';

interface jwtpayloadInterface {
  jwtToken: any;
  email: string;
  password: string;
  iat: number;
  exp: number;
}

export class UserInterceptor implements NestInterceptor {
  constructor(private readonly prismaService: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const jwtToken = request?.headers?.authorization?.split(' ')[1];
    const user = (await jwt.decode(jwtToken)) as jwtpayloadInterface;
    request.user = user;
    return next.handle();
  }
}
