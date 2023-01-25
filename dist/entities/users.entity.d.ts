import { Locations } from './locations.entity';
import { Guesses } from './guesses.entity';
import { CustomBaseEntity } from './base.entity';
export declare class Users extends CustomBaseEntity {
    email: string;
    password: string;
    name: string;
    surname: string;
    profilePicture: string;
    resetToken: string;
    resetTokenExpiration: Date;
    locations: Locations[];
    guesses: Guesses[];
}
