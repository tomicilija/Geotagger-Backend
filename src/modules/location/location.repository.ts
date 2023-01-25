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

const DEFAULT_IMAGE = 'DefaultAvatar.png';
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

@EntityRepository(Locations)
export class LocationRepository extends Repository<Locations> {
  private logger = new Logger('LocationRepository');

  async createLocation(
    user: Users,
    locationDto: LocationDto,
    file: Express.Multer.File,
  ): Promise<Locations> {
    const { name, latitude, longitude } = locationDto;
    let locationImagePath = DEFAULT_IMAGE;

    if (file != undefined) {
      if (file.size < FILE_SIZE_LIMIT) {
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
      `User with email ${user.email} added a new location "${name}"!`,
    );
    return location;
  }

  async getLocations(page: number, size: number): Promise<Locations[]> {
    const getLocations = await this.find({
      order: {
        createdAt: 'DESC',
      },
      take: size,
    });
    return getLocations;
  }

  async getMyLocations(
    user: Users,
    page: number,
    size: number,
  ): Promise<Locations[]> {
    const id = user.id;
    const getLocations = await this.createQueryBuilder()
      .where('user_id = :id', { id })
      .take(size)
      .getMany();
    return getLocations;
  }

  async getLocationImage(id: string, res) {
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Location wth ID: "${id}"" not found!`);
      throw new NotFoundException(`Location wth ID: "${id}" not found`);
    }
    const image = res.sendFile(
      join(process.cwd(), 'uploads/locations/' + location.image),
    );
    return image;
  }

  async getRandomLocationsId(): Promise<Locations[]> {
    const totalLocations = await this.count();
    const offset = Math.floor(Math.random() * totalLocations);
    const getRandomLocation = this.createQueryBuilder()
      .select([
        'location.id',
      ])
      .from(Locations, 'location')
      .offset(offset)
      .limit(3)
      .getMany();
    return getRandomLocation;
  }

  async getLocationById(id: string): Promise<Locations> {
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Location with ID: ${id} not found!`);
      throw new NotFoundException(`Location with ID: ${id} not found!`);
    }
    this.logger.log(`Fetched location with ID: ${id} from the database!`);
    return location;
  }

  async deleteLocation(user: Users, id: string): Promise<Locations> {
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Location with ID: ${id} not found!`);
      throw new NotFoundException(`Location with ID: ${id} not found!`);
    }
    if (location.user_id === user.id) {
      await this.query('DELETE FROM guesses WHERE location_id = $1', [
        location.id,
      ]);
      await this.remove(location);
      this.logger.verbose(
        `User with email: ${user.email} has successfully deleted location with id: ${id}!`,
      );
      return location;
    } else {
      this.logger.error(
        `User with email: ${user.email} does not have permission to delete this location!`,
      );
      throw new UnauthorizedException(
        `User with email: ${user.email} does not have permission to delete this location!`,
      );
    }
  }

  async editLocation(
    user: Users,
    id: string,
    locationDto: LocationDto,
    file: Express.Multer.File,
  ): Promise<Locations> {
    const { name, latitude, longitude } = locationDto;
    const location = await this.findOne(id);
    if (!location) {
      this.logger.error(`Location with ID: ${id} not found!`);
      throw new NotFoundException(`Location with ID: ${id} not found!`);
    }
    
    let locationImagePath = DEFAULT_IMAGE;

    if (file != undefined) {
      if (file.size < FILE_SIZE_LIMIT) {
        locationImagePath = file.filename;
      }
    }

    if (location.user_id === user.id) {
      location.name = name;
      location.latitude = latitude;
      location.longitude = longitude;
      location.image = locationImagePath;
      await this.save(location);
      this.logger.log(
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
