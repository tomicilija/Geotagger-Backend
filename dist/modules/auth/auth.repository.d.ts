/// <reference types="multer" />
import { Repository } from 'typeorm';
import { Users } from '../../entities/users.entity';
import { UserRegisterDto } from './dto/user-register.dto';
export declare class AuthRepository extends Repository<Users> {
    private logger;
    register(userRegisterDto: UserRegisterDto, file: Express.Multer.File): Promise<void>;
}
