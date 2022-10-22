import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from '../../../src/entities/users.entity';

// This returns value of decorated parameter
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): Users => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
