import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { LocationService } from './location.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationRepository]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
