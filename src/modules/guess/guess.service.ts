import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../../entities/users.entity';
import { GuessDto } from './dto/guess.dto';
import { Guesses } from '../../entities/guesses.entity';
import { GuessRepository } from './guess.repository';

@Injectable()
export class GuessService {
  constructor(
    @InjectRepository(GuessRepository)
    private guessRepository: GuessRepository,
  ) {}
  async getMyGuesses(user: Users): Promise<Guesses[]> {
    return this.guessRepository.getMyGuesses(user);
  }

  async getGuessById(id: string): Promise<Guesses[]> {
    return this.guessRepository.getGuessById(id);
  }

  async guessLocation(
    user: Users,
    id: string,
    guessnDto: GuessDto,
  ): Promise<Guesses> {
    return this.guessRepository.guessLocation(user, id, guessnDto);
  }
}
