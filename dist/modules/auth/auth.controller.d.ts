/// <reference types="multer" />
import { AuthService } from './auth.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(userRegisterDto: UserRegisterDto, file: Express.Multer.File): Promise<void>;
    login(userLoginDto: UserLoginDto): Promise<{
        accessToken: string;
    }>;
}
