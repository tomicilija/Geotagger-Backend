import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from '../dto/jwt-payload.dto';
import { Users } from '../../../entities/users.entity';
import { AuthRepository } from '../auth.repository';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private authRepository;
    constructor(authRepository: AuthRepository, configService: ConfigService);
    validate(payload: JwtPayloadDto): Promise<Users>;
}
export {};
