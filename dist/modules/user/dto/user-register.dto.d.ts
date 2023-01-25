/// <reference types="multer" />
export declare class UserRegisterDto {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    surname: string;
    profilePicture: Express.Multer.File;
}
