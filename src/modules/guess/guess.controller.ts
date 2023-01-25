import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
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

  @Get('/guesses/me')
  async getMyGuesses(
    @GetUser() user: Users,
    @Query('page') page = 1,
    @Query('size') size = 3,
  ): Promise<Guesses[]> {
    return this.guessService.getMyGuesses(user, page, size);
  }

  @Get('/guess/:id')
  async getGuessById(@Param('id') id: string): Promise<Guesses[]> {
    return this.guessService.getGuessById(id);
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
