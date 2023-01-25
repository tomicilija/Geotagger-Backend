/// <reference types="multer" />
import { JwtService } from '@nestjs/jwt';
import { UserRegisterDto } from './dto/user-register.dto';
import { AuthRepository } from './auth.repository';
import { UserLoginDto } from './dto/user-login.dto';
export declare class AuthService {
    private authRepository;
    private jwtService;
    constructor(authRepository: AuthRepository, jwtService: JwtService);
    private logger;
    register(userRegisterDto: UserRegisterDto, file: Express.Multer.File): Promise<void>;
    login(loginUserDto: UserLoginDto): Promise<{
        accessToken: string;
    }>;
}
