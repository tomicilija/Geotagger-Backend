import { Repository } from 'typeorm';
import { Users } from '../../entities/users.entity';
import { Guesses } from 'src/entities/guesses.entity';
import { GuessLocationDto } from './dto/guess-location.dto';
export declare class GuessRepository extends Repository<Guesses> {
    private logger;
    getGuesses(id: string): Promise<Guesses[]>;
    guessLocation(user: Users, id: string, guessLocationDto: GuessLocationDto): Promise<Guesses>;
    calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any): number;
}
