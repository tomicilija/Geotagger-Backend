import { EnvVars } from './../../../common/constants/env-vars.contant';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { Users } from '../../../entities/users.entity';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthRepository)
    private authRepository: AuthRepository,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get(EnvVars.JWT_SECRET),
    });
  }

  

  //Override default function and provide it with some logic of what we want do do after we know token is valid
  async validate(payload: JwtPayloadDto): Promise<Users> {
    const { email } = payload;
    const user: Users = await this.authRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
