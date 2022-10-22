import { EntityRepository, Repository } from 'typeorm';
import { Locations } from '../../entities/locations.entity';
import { LocationDto } from './dto/location.dto';
import { Users } from '../../entities/users.entity';
import { Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Guesses } from 'src/entities/guesses.entity';
import { GuessLocationDto } from './dto/guess-location.dto';

@EntityRepository(Locations)
export class LocationRepository extends Repository<Locations> {
  private logger = new Logger('LocationRepository');

  async getLocations(): Promise<Locations[]> {
    try {
      const getLocations = await this.createQueryBuilder()
        .select([
          'location.id',
          'location.latitude',
          'location.longitude',
          'location.image',
          'location.createdAt',
          'location.updatedAt',
          'location.userId',
        ])
        .from(Locations, 'location')
        .orderBy('location.createdAt', 'DESC')
        .groupBy('location.id')
        .getMany();

      this.logger.verbose(
        `Fetched ${getLocations.length} locations from the database!`,
      );
      return getLocations;
    } catch (error) {
      return error;
    }
  }

  async getRandomLocation(): Promise<Locations> {
    try {
      const getRandomLocation = this.createQueryBuilder()
        .select([
          'location.id',
          'location.latitude',
          'location.longitude',
          'location.image',
          'location.createdAt',
          'location.updatedAt',
          'location.userId',
        ])
        .from(Locations, 'location')
        .orderBy('RANDOM()')
        .limit(1)
        .getOne();

      this.logger.verbose(`Fetched random location from the database!`);
      return getRandomLocation;
    } catch (error) {
      return error;
    }
  }

  async getLocationById(id: string): Promise<Locations> {
    const location = await this.findOne({
      where: {
        id: id,
      },
    });
    if (!location) {
      throw new NotFoundException(`Location not found`);
    }
    return location;
  }
  async createLocation(
    user: Users,
    locationDto: LocationDto,
  ): Promise<Locations> {
    const { name, latitude, longitude, image } = locationDto;
    try {
      const location = new Locations();
      location.name = name;
      location.latitude = latitude;
      location.longitude = longitude;
      location.image = image;
      location.user_id = user.id; // eslint-disable-line @typescript-eslint/camelcase

      await this.save(location);
      this.logger.verbose(
        `User "${user.name} ${user.surname}" added a new location ${name}!`,
      );
      return location;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async deleteLocation(user: Users, id: string): Promise<Locations> {
    try {
      const location = await this.findOne({
        where: {
          id: id,
        },
      });
      if (location.user_id === user.id) {
        await this.remove(location);
        this.logger.verbose(
          `user with email: ${user.email} has successfully deleted location with id: ${id}!`,
        );
        return location;
      } else {
        this.logger.error(
          `User with email: ${user.email} does not have permission to delete this location!`,
        );
        throw new UnauthorizedException();
      }
    } catch (error) {
      return error;
    }
  }

  // Edit location
  async editLocation(
    user: Users,
    id: string,
    locationDto: LocationDto,
  ): Promise<Locations> {
    const { name, latitude, longitude, image } = locationDto;
    const location = await this.findOne({
      where: {
        id: id,
      },
    });

    if (location.user_id === user.id) {
      try {
        location.name = name;
        location.latitude = latitude;
        location.longitude = longitude;
        location.image = image;
        location.user_id = user.id; // eslint-disable-line @typescript-eslint/camelcase
        await this.save(location);
        this.logger.verbose(
          `User with email: ${user.email} successfully edited the location with id ${id}!`,
        );
      } catch (error) {
        return error;
      }
    } else {
      this.logger.error(
        `User with email: ${user.email} does not have permission to edit this location!`,
      );
      throw new UnauthorizedException();
    }
  }
}
