import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { Users } from '../../entities/users.entity';
import { Guesses } from '../../entities/guesses.entity';
import { Locations } from '../../entities/locations.entity';
import { GuessDto } from './dto/guess.dto';

@EntityRepository(Guesses)
export class GuessRepository extends Repository<Guesses> {
  private logger = new Logger('GuessRepository');

  async getMyGuesses(
    user: Users,
    page: number,
    size: number,
  ): Promise<Guesses[]> {
    const id = user.id;
    const getMyGuesses = await this.createQueryBuilder()
      .where('user_id = :id', { id })
      .take(size)
      .orderBy('distance', 'ASC')
      .getMany();
    return getMyGuesses;
  }

  async getGuessById(id: string): Promise<Guesses[]> {
    const getGuesses = await this.createQueryBuilder()
      .select([
        'guess.id',
        'guess.distance',
        'guess.createdAt',
        'user.id',
        'user.name',
        'user.surname',
        'user.profilePicture',
      ])
      .from(Guesses, 'guess')
      .leftJoin('guess.user', 'user')
      .where('guess.location_id = :id', { id })
      .take(14)
      .orderBy('guess.distance', 'ASC')
      .getMany();
    return getGuesses;
  }

  async guessLocation(
    user: Users,
    id: string,
    guessnDto: GuessDto,
  ): Promise<Guesses> {
    const { latitude, longitude } = guessnDto;
    const location = await this.createQueryBuilder()
      .select([
        'location.id',
        'location.latitude',
        'location.longitude',
        'location.name',
      ])
      .from(Locations, 'location')
      .where('location.id = :id', { id })
      .getOne();

    if (!location) {
      this.logger.error(`Location with ID: ${id} not found!`);
      throw new NotFoundException(`Location with ID: ${id} not found!`);
    }

    const checkGuess = await this.findOne({
      where: {
        location_id: id,
        user_id: user.id,
      },
    });
    if (checkGuess) {
      this.logger.error(
        `User with email ${user.email} already submitted a guess for this location`,
      );
      throw new ConflictException(
        `User with email ${user.email} already submitted a guess for this location`,
      );
    }

    const distance = this.calculateDistance(
      location.latitude,
      location.longitude,
      latitude,
      longitude,
    );

    const guess = new Guesses();
    guess.distance = distance;
    guess.user_id = user.id;
    guess.location_id = location.id;
    await this.save(guess);
    this.logger.log(
      `User with email ${user.email} added a new "${location.name}" guess! With error distance: "${distance}" m`,
    );
    return guess;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = (lon1 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    const dlon = lon2 - lon1;
    const dlat = lat2 - lat1;
    const a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    const c = 2 * Math.asin(Math.sqrt(a));
    const r = 6371e3; //in meters

    // calculate the result
    const distance = c * r;

    // remove decimals
    return distance >> 0;
  }
}
