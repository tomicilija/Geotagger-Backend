import { Users } from '../../entities/users.entity';
import { GuessDto } from './dto/guess.dto';
import { Guesses } from '../../entities/guesses.entity';
import { GuessRepository } from './guess.repository';
export declare class GuessService {
    private guessRepository;
    constructor(guessRepository: GuessRepository);
    getMyGuesses(user: Users, page: number, size: number): Promise<Guesses[]>;
    getGuessById(id: string): Promise<Guesses[]>;
    guessLocation(user: Users, id: string, guessnDto: GuessDto): Promise<Guesses>;
}
