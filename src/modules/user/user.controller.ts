import {
  Controller,
  Get,
  Body,
  Delete,
  Patch,
  UseGuards,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from '../../entities/users.entity';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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

  // Updates all information of loggend in user (email, pass, name and surname)
  @Patch('/update-password')
  updateUser(
    @GetUser() user: Users,
    @Body() userRegisterDto: UserRegisterDto,
  ): Promise<Users> {
    return this.userService.updateUser(user, userRegisterDto);
  }
}
