import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'It works!';
  }
}
