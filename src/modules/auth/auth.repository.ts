import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Users } from '../../entities/users.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';

const DEFAULT_AVATAR = 'DefaultAvatar.png';
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

@EntityRepository(Users)
export class AuthRepository extends Repository<Users> {
  private logger = new Logger('AuthRepository');

  // Creates user with email, pass, name, surname and profile picture
  async register(
    userRegisterDto: UserRegisterDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const { email, password, passwordConfirm, name, surname } = userRegisterDto;
    let profilePicturePath = DEFAULT_AVATAR;

    if (file != undefined) {
      if (file.size < FILE_SIZE_LIMIT) {
        profilePicturePath = file.filename;
      }
    }
    // Do passwords match?
    if (password !== passwordConfirm) {
      this.logger.error(`Passwords do not match!`);
      throw new ConflictException('Passwords do not match!');
    } else {
      // Password Hash
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.create({
        email,
        password: hashedPassword,
        name,
        surname,
        profilePicture: profilePicturePath,
      });
      try {
        await this.save(user);
        this.logger.log(`User with ${email} email is saved in a database!`);
      } catch (error) {
        //Catches Duplicate email with error code 23505
        if (error.code === '23505') {
          this.logger.error(`User is already registerd with "${email}" email!`);
          throw new ConflictException(
            `User is already registerd with "${email}" email!`,
          );
        } else {
          throw new InternalServerErrorException(error);
        }
      }
    }
  }
}
