import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { Users } from '../../entities/users.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthRepository } from './auth.repository';
import { UserLoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}

  // Creates user with email, pass, name, surname and profile picture
  async register(userRegisterDto: UserRegisterDto): Promise<void> {
    return this.authRepository.register(userRegisterDto);
  }

  
/*
  // Signs in user with email and pass
  async login(loginUserDto: UserLoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    // Checks if there is user found and if password matches with one in database
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayloadDto = { email };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login creentials');
    }
  }
  */
}
