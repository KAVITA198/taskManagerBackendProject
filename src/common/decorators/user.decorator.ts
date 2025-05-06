import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  if (!request.user) throw new UnauthorizedException({ message: 'Required jwt Token' });
  return request.user;
});
