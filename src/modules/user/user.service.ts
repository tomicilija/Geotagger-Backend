import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
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

  // Gets all information of loggend in user 
  async getUserById(user_id: string): Promise<Users> {// eslint-disable-line @typescript-eslint/camelcase
    return this.userRepoitory.getUserById(user_id);
  }
  // Delete logged in user
  async deleteUser(user: Users): Promise<void> {
    this.userRepoitory.deleteUser(user);
  }

  // Updates all information of loggend in user (email, pass, name and surname)
  updateUser(user: Users, userRegisterDto: UserRegisterDto): Promise<Users> {
    return this.userRepoitory.updateUser(user, userRegisterDto);
  }
}
