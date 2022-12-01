import { Body, Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

export const storage = {
  storage: diskStorage({
    destination: './uploads/profile-pictures',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@ApiTags('Authentication')
@Controller()
export class AuthController {
  // Controller declares a dependency on the UserService token with constructor
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('profilePicture', storage))
  async register(@UploadedFile() file, @Body() userRegisterDto: UserRegisterDto) {
    return this.authService.register(userRegisterDto, file);
  }

  @Post('/login')
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(userLoginDto);
  }
}
