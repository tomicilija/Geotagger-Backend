import { EntityRepository, Repository } from 'typeorm';
import { Users } from '../../entities/users.entity';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { Guesses } from '../../entities/guesses.entity';
import { GuessDto } from './dto/guess.dto';

@EntityRepository(Guesses)
export class GuessRepository extends Repository<Guesses> {
  private logger = new Logger('GuessRepository');

  async getMyGuesses(user: Users): Promise<Guesses[]> {
    const getMyGuesses = await this.find({ where: { user_id: user.id } }); // eslint-disable-line @typescript-eslint/camelcase
    
    this.logger.verbose(
      `Fetched ${getMyGuesses.length} guesses of user: ${user.email} from the database!`,
    );
    
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
      .orderBy('guess.distance', 'ASC')
      .getMany();

    this.logger.verbose(
      `Fetched ${getGuesses.length} guesses for location: ${id} from the database!`,
    );
    return getGuesses;
  }

  async guessLocation(
    user: Users,
    id: string,
    guessnDto: GuessDto,
  ): Promise<Guesses> {
    const { latitude, longitude } = guessnDto;
    const location = await this.query('SELECT * FROM locations WHERE id = $1', [
      id,
    ]);

    if (!location) {
      this.logger.error(`Location with ID: ${id} not found!`);
      throw new NotFoundException(`Location with ID: ${id} not found!`);
    }

    const checkGuess = await this.findOne({
      where: {
        /* eslint-disable @typescript-eslint/camelcase*/
        location_id: id,
        user_id: user.id,
        /* eslint-enable @typescript-eslint/camelcase*/
      },
    });
/*
    if (checkGuess) {
      this.logger.verbose(
        `User "${user.name} ${user.surname}" already submited guess for this locaton`,
      );
      throw new ConflictException(
        `User "${user.name} ${user.surname}" already submited guess for this locaton`,
      );
    }*/

    const distance = this.calculateDistance(
      location[0].latitude,
      location[0].longitude,
      latitude,
      longitude,
    );

    const guess = new Guesses();
    guess.distance = distance;
    /* eslint-disable @typescript-eslint/camelcase*/
    guess.user_id = user.id;
    guess.location_id = location[0].id;
    /* eslint-enable @typescript-eslint/camelcase*/
    await this.save(guess);
    this.logger.verbose(
      `User "${user.name} ${user.surname}" added a new "${location[0].name}" guess! With error distance: "${distance}" m`,
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
