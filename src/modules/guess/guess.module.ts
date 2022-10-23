import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { GuessRepository } from './guess.repository';
import { GuessController} from './guess.controller';
import { GuessService } from './guess.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([GuessRepository]),
    AuthModule,
  ],
  controllers: [GuessController],
  providers: [GuessService],
})
export class GuessModule {}
