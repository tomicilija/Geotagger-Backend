import {
  Controller,
  Get,
  Body,
  Delete,
  Patch,
  UseGuards,
  Param,
  Res,
  UseInterceptors,
  UploadedFile,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from '../../entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { profileImagesStorage } from '../../common/storage/profile-images.storage';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto copy';

@ApiTags('User')
@Controller('me')
export class UserController {
  // Controller declares a dependency on the UserService token with constructor
  constructor(private userService: UserService) {}

  // Gets all information of loggend in user
  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  getLoggedInUser(@GetUser() user: Users): Promise<Users> {
    return this.userService.getLoggedInUser(user);
  }

  // Gets user profile picture
  @Get('/profilepicture/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  getUserProfilePicture(@Param('id') user_id: string, @Res() res) {
    return this.userService.getUserProfilePicture(user_id, res);
  }

  // Gets all of the users information with this specific id
  @Get('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  getUserById(@Param('id') user_id: string): Promise<Users> {
    return this.userService.getUserById(user_id);
  }

  // Delete logged in user
  @Delete()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  deleteUser(@GetUser() user: Users): Promise<void> {
    return this.userService.deleteUser(user);
  }

  // Updates information of loggend in user (email, name and surname)
  @Patch('/update-user')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  updateUser(
    @GetUser() user: Users,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.userService.updateUser(user, updateUserDto);
  }

  // Updates profile picture of loggend in user
  @Patch('/update-profilepicture')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePicture', profileImagesStorage))
  updateProfilePicture(
    @GetUser() user: Users,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Users> {
    return this.userService.updateProfilePicture(user, file);
  }

  // Updates password of loggend in user
  @Patch('/update-password')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  updatePassword(
    @GetUser() user: Users,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Users> {
    return this.userService.updatePassword(user, updatePasswordDto);
  }

  // Requests token for new password
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const resetToken = await this.userService.generateResetToken(forgotPasswordDto);
    await this.userService.sendResetEmail(forgotPasswordDto, resetToken);
  } 

  // Sets new password
  @Patch('reset-password')
  async resetPassword(
    @Body() reserPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.userService.resetPassword(reserPasswordDto);
  }
}
