import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
@ApiTags('Authentication')
@Controller()
export class AuthController {
  // Controller declares a dependency on the UserService token with constructor
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto);
  }

  @Post('/login')
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(userLoginDto);
  }
}
