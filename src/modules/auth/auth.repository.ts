import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from '../../entities/users.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(Users)
export class AuthRepository extends Repository<Users> {
  constructor( // To make JwtService work
    @InjectRepository(AuthRepository)
    private jwtService: JwtService,
  ) {
    super();
  }

  // Creates user with email, pass, name, surname and profile picture
  async register(userRegisterDto: UserRegisterDto): Promise<void> {
    const {
      email,
      password,
      passwordConfirm,
      name,
      surname,
      profilePicture,
    } = userRegisterDto;

    // Do passwords match?
    if (password !== passwordConfirm) {
      throw new ConflictException('Passwords do not match');
    } else {
      // Password Hash
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = this.create({
        email,
        password: hashedPassword,
        name,
        surname,
        profilePicture,
      });
      try {
        await this.save(user);
      } catch (error) {
        //Catches Duplicate email with error code 23505
        if (error.code === '23505') {
          throw new ConflictException(
            'User is already registerd with that email!',
          );
        } else {
          throw new InternalServerErrorException();
        }
      }
    }
  }
}
