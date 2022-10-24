import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { LocationService } from './location.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LocationRepository]),
    AuthModule,
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
