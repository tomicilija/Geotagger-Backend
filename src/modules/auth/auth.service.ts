import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthRepository } from './auth.repository';
import { UserLoginDto } from './dto/user-login.dto';

const DEFAULT_AVATAR = 'DefaultAvatar.png';
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('AuthRepository');

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

      const newUser = {email, hashedPassword, name, surname, profilePicturePath};

      return this.authRepository.register(newUser);
    }
  }

  async login(loginUserDto: UserLoginDto): Promise<{ accessToken: string }> {
    const { email } = loginUserDto;
    this.authRepository.login(loginUserDto);
    const payload: JwtPayloadDto = { email };
    const accessToken: string = this.jwtService.sign(payload);

    if (accessToken) {
      this.logger.log(`User with "${email}" email is logged in!`);
      return { accessToken };
    } else {
      this.logger.error(`Can't get access token!`);
      throw new UnauthorizedException(`Can't get access token`);
    }
  }
}
