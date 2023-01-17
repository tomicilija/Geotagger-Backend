import { EntityRepository, Repository } from 'typeorm';
import { Locations } from '../../entities/locations.entity';
import { LocationDto } from './dto/location.dto';
import { Users } from '../../entities/users.entity';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { join } from 'path';

@EntityRepository(Locations)
export class LocationRepository extends Repository<Locations> {
  private logger = new Logger('LocationRepository');

  async createLocation(
    user: Users,
    locationDto: LocationDto,
    file: Express.Multer.File,
  ): Promise<Locations> {
    const { name, latitude, longitude } = locationDto;
    
    const fileSize = 5 * 1024 * 1024; // 5 MB
    let locationImagePath = 'locationImage.jpg';

    if (file != undefined) {
      if (file.size < fileSize) {
        locationImagePath = file.filename;
      }
    }

    const location = new Locations();
    location.name = name;
    location.latitude = latitude;
    location.longitude = longitude;
    location.image = locationImagePath;
    location.user_id = user.id; // eslint-disable-line @typescript-eslint/camelcase

    await this.save(location);
    this.logger.verbose(
      `User "${user.name} ${user.surname}" added a new location "${name}"!`,
    );
    return location;
  }

  async getLocations(): Promise<Locations[]> {
    const getLocations = await this.find();
    this.logger.verbose(
      `Fetched ${getLocations.length} locations from the database!`,
    );
    return getLocations;
  }

  async getUserProfilePicture(id: string, res) {
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`User wth ID: "${id}"" not found!`);
      throw new NotFoundException(`User wth ID: "${id}" not found`);
    }
    const image = res.sendFile(
      join(process.cwd(), 'uploads/locations/' + location.image),
    );
    return image;
  }

  async getRandomLocation(): Promise<Locations> {
    const getRandomLocation = this.createQueryBuilder()
      .select([
        'location.id',
        'location.name',
        'location.latitude',
        'location.longitude',
        'location.image',
      ])
      .from(Locations, 'location')
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();

    this.logger.verbose(`Fetched random location from the database!`);
    return getRandomLocation;
  }

  async getLocationById(id: string): Promise<Locations> {
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Location with ID: ${id} not found!`);
      throw new NotFoundException(`Location with ID: ${id} not found!`);
    }
    this.logger.verbose(`Fetched location with ID: ${id} from the database!`);
    return location;
  }

  async deleteLocation(user: Users, id: string): Promise<Locations> {
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Location with ID: ${id} not found!`);
      throw new NotFoundException(`Location with ID: ${id} not found!`);
    }
    if (location.user_id === user.id) {
      await this.remove(location);
      this.logger.verbose(
        `User with email: ${user.email} has successfully deleted location with id: ${id}!`,
      );
      return location;
    } else {
      this.logger.error(
        `User with email: ${user.email} does not have permission to delete their location!`,
      );
      throw new UnauthorizedException(
        `User with email: ${user.email} does not have permission to delete their location!`,
      );
    }
  }

  async editLocation(
    user: Users,
    id: string,
    locationDto: LocationDto,
  ): Promise<Locations> {
    const { name, latitude, longitude } = locationDto;
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Location with ID: ${id} not found!`);
      throw new NotFoundException(`Location with ID: ${id} not found!`);
    }
    const locationImagePath = 'locationImage.jpgs';
    if (location.user_id === user.id) {
      location.name = name;
      location.latitude = latitude;
      location.longitude = longitude;
      location.image = locationImagePath;
      await this.save(location);
      this.logger.verbose(
        `User with email: ${user.email} successfully edited the location with id ${id}!`,
      );
      return location;
    } else {
      this.logger.error(
        `User with email: ${user.email} does not have permission to edit this location!`,
      );
      throw new UnauthorizedException();
    }
  }
}
