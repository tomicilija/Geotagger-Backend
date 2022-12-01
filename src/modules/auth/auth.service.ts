import {
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    private jwtService: JwtService,
  ) {}
  private logger = new Logger('AuthRepository');

  async register(userRegisterDto: UserRegisterDto, file: Express.Multer.File): Promise<void> {
    return this.authRepository.register(userRegisterDto, file);
  }

  async login(loginUserDto: UserLoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginUserDto;
    const user = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayloadDto = { email };
      const accessToken: string = this.jwtService.sign(payload);
      this.logger.verbose(
        `User with "${email}" email is logged in!`,
      );
      return { accessToken };
    } else {
      this.logger.verbose(
        `User login creentials are incorrect!`,
      );
      throw new UnauthorizedException('Please check your login creentials');
    }
  }
}
