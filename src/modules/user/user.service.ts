import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';

// Injectable decorator declares the UserService class
@Injectable()
export class UserService {
  // Constructor based dependency injection used to inject instances (often service providers) into classes.
  constructor(
    @InjectRepository(UserRepository)
    private userRepoitory: UserRepository,
  ) {}

  // Gets all of the users information with this specific id
  async getLoggedInUser(user: Users): Promise<Users> {
    return this.userRepoitory.getLoggedInUser(user);
  }

  // Gets user profile picture
  async getUserProfilePicture(user_id: string, res){// eslint-disable-line @typescript-eslint/camelcase
    return this.userRepoitory.getUserProfilePicture(user_id, res);
  }

  // Gets all information of loggend in user 
  async getUserById(user_id: string): Promise<Users> {// eslint-disable-line @typescript-eslint/camelcase
    return this.userRepoitory.getUserById(user_id);
  }
  // Delete logged in user
  async deleteUser(user: Users): Promise<void> {
    this.userRepoitory.deleteUser(user);
  }

  // Updates information of loggend in user (email, name and surname)
  updateUser(user: Users, updateUserDto: UpdateUserDto): Promise<Users> {
    return this.userRepoitory.updateUser(user, updateUserDto);
  }

  // Updates profile picture of loggend in user
  updateProfilePicture(user: Users, file: Express.Multer.File): Promise<Users> {
    return this.userRepoitory.updateProfilePicture(user, file);
  }

  // Updates password of loggend in user
  updatePassword(user: Users, updatePasswordDto: UpdatePasswordDto): Promise<Users> {
    return this.userRepoitory.updatePassword(user, updatePasswordDto);
  }
}
