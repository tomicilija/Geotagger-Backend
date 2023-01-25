import { Guesses } from '../../entities/guesses.entity';
import { Users } from '../../entities/users.entity';
import { GuessDto } from './dto/guess.dto';
import { GuessService } from './guess.service';
export declare class GuessController {
    private guessService;
    constructor(guessService: GuessService);
    getMyGuesses(user: Users, page?: number, size?: number): Promise<Guesses[]>;
    getGuessById(id: string): Promise<Guesses[]>;
    guessLocation(user: Users, id: string, guessnDto: GuessDto): Promise<Guesses>;
}
