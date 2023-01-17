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
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from '../../entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { profileImagesStorage } from 'src/common/storage/profile-images.storage';

@ApiTags('User')
@Controller('me')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class UserController {
  // Controller declares a dependency on the UserService token with constructor
  constructor(private userService: UserService) {}

  // Gets all information of loggend in user
  @Get()
  getLoggedInUser(@GetUser() user: Users): Promise<Users> {
    return this.userService.getLoggedInUser(user);
  }

  // Gets user profile picture
  @Get('/profilepicture/:id')
  getUserProfilePicture(@Param('id') user_id: string, @Res() res) {// eslint-disable-line @typescript-eslint/camelcase
    return this.userService.getUserProfilePicture(user_id, res);
  }

  // Gets all of the users information with this specific id
  @Get('/:id')
  getUserById(@Param('id') user_id: string): Promise<Users> {// eslint-disable-line @typescript-eslint/camelcase
    return this.userService.getUserById(user_id);
  }

  // Delete logged in user
  @Delete()
  deleteUser(@GetUser() user: Users): Promise<void> {
    return this.userService.deleteUser(user);
  }

  // Updates information of loggend in user (email, name and surname)
  @Patch('/update-user')
  updateUser(
    @GetUser() user: Users,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Users> {
    return this.userService.updateUser(user, updateUserDto);
  }

  // Updates profile picture of loggend in user
  @Patch('/update-profilepicture')
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
  updatePassword(
    @GetUser() user: Users,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Users> {
    return this.userService.updatePassword(user, updatePasswordDto);
  }
}
