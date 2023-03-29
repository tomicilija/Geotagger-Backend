import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from '../../entities/users.entity';
import { UserLoginDto } from './dto/user-login.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(Users)
export class AuthRepository extends Repository<Users> {
  private logger = new Logger('AuthRepository');

  // Creates user with email, pass, name, surname and profile picture
  async register(newUser): Promise<void> {
    const user = this.create({
      email: newUser.email,
      password: newUser.hashedPassword,
      name: newUser.name,
      surname: newUser.surname,
      profilePicture: newUser.profilePicturePath,
    });
    try {
      await this.save(user);
      this.logger.log(
        `User with ${newUser.email} email is saved in a database!`,
      );
    } catch (error) {
      //Catches Duplicate email with error code 23505
      if (error.code === '23505') {
        this.logger.error(
          `User is already registerd with "${newUser.email}" email!`,
        );
        throw new ConflictException(
          `User is already registerd with "${newUser.email}" email!`,
        );
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  // User Login
  async login(loginUserDto: UserLoginDto): Promise<void> {
    const { email, password } = loginUserDto;
    const user = await this.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      this.logger.log(`Password email and password are correct!`);
    } else {
      this.logger.error(`User login creentials are incorrect!`);
      throw new UnauthorizedException('Please check your login creentials');
    }
  }
}
