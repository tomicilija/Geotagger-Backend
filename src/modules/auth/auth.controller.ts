import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { profilePictureStorage } from '../../common/storage/images.storage';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  // Controller declares a dependency on the UserService token with constructor
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture', profilePictureStorage))
  async register(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.authService.register(userRegisterDto, file);
  }

  @Post('/login')
  async login(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(userLoginDto);
  }
}
