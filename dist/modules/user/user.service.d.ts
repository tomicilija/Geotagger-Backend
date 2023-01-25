/// <reference types="multer" />
import { Users } from '../../entities/users.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto copy';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
export declare class UserService {
    private userRepoitory;
    constructor(userRepoitory: UserRepository);
    getLoggedInUser(user: Users): Promise<Users>;
    getUserProfilePicture(user_id: string, res: any): Promise<any>;
    getUserById(user_id: string): Promise<Users>;
    deleteUser(user: Users): Promise<void>;
    updateUser(user: Users, updateUserDto: UpdateUserDto): Promise<Users>;
    updateProfilePicture(user: Users, file: Express.Multer.File): Promise<Users>;
    updatePassword(user: Users, updatePasswordDto: UpdatePasswordDto): Promise<Users>;
    generateResetToken(forgotPasswordDto: ForgotPasswordDto): Promise<string>;
    sendResetEmail(forgotPasswordDto: ForgotPasswordDto, resetToken: string): Promise<void>;
    resetPassword(reserPasswordDto: ResetPasswordDto): Promise<boolean>;
}
