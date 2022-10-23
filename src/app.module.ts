import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import typeOrmModuleOptions from './config/orm.config';
import { Locations } from './entities/locations.entity';
import { Users } from './entities/users.entity';
import { AuthModule } from './modules/auth/auth.module';
import { LocationModule } from './modules/location/location.module';
import { GuessModule } from './modules/guess/guess.module';
import { Guesses } from './entities/guesses.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmModuleOptions,
    }),
    TypeOrmModule.forFeature([Users, Locations, Guesses]),
    AuthModule,
    LocationModule,
    GuessModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
