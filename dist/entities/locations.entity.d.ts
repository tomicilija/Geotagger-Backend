import { Guesses } from './guesses.entity';
import { CustomBaseEntity } from './base.entity';
export declare class Locations extends CustomBaseEntity {
    name: string;
    latitude: number;
    longitude: number;
    image: string;
    user_id: string;
    user: string;
    guesses: Guesses[];
}
