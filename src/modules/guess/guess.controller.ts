import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Guesses } from '../../entities/guesses.entity';
import { Users } from '../../entities/users.entity';
import { GetUser } from '../user/get-user.decorator';
import { GuessDto } from './dto/guess.dto';
import { GuessService } from './guess.service';

@ApiTags('Guess')
@Controller('location')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class GuessController {
  constructor(private guessService: GuessService) {}

  @Get('/guesses/:id')
  async getGuesses(@Param('id') id: string): Promise<Guesses[]> {
    return this.guessService.getGuesses(id);
  }

  @Post('/guess/:id')
  async guessLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() guessnDto: GuessDto,
  ): Promise<Guesses> {
    return this.guessService.guessLocation(user, id, guessnDto);
  }
}
