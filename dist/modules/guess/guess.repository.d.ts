import { Repository } from 'typeorm';
import { Users } from '../../entities/users.entity';
import { Guesses } from '../../entities/guesses.entity';
import { GuessDto } from './dto/guess.dto';
export declare class GuessRepository extends Repository<Guesses> {
    private logger;
    getMyGuesses(user: Users, page: number, size: number): Promise<Guesses[]>;
    getGuessById(id: string): Promise<Guesses[]>;
    guessLocation(user: Users, id: string, guessnDto: GuessDto): Promise<Guesses>;
    calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any): number;
}
