/// <reference types="multer" />
import { UserService } from './user.service';
import { Users } from '../../entities/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto copy';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getLoggedInUser(user: Users): Promise<Users>;
    getUserProfilePicture(user_id: string, res: any): Promise<any>;
    getUserById(user_id: string): Promise<Users>;
    deleteUser(user: Users): Promise<void>;
    updateUser(user: Users, updateUserDto: UpdateUserDto): Promise<Users>;
    updateProfilePicture(user: Users, file: Express.Multer.File): Promise<Users>;
    updatePassword(user: Users, updatePasswordDto: UpdatePasswordDto): Promise<Users>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void>;
    resetPassword(reserPasswordDto: ResetPasswordDto): Promise<void>;
}
