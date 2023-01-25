import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRepository } from './location.repository';
import { Locations } from '../../entities/locations.entity';
import { LocationDto } from './dto/location.dto';
import { Users } from '../../entities/users.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationRepository)
    private locationRepository: LocationRepository,
  ) {}

  async createLocation(
    user: Users,
    locationDto: LocationDto,
    file: Express.Multer.File,
  ): Promise<Locations> {
    return this.locationRepository.createLocation(user, locationDto, file);
  }

  async getLocations(page: number, size: number): Promise<Locations[]> {
    return this.locationRepository.getLocations(page, size);
  }

  async getMyLocations(user: Users, page: number, size: number): Promise<Locations[]> {
    return this.locationRepository.getMyLocations(user, page, size);
  }

  async getLocationImage(id: string, res) {
    return this.locationRepository.getLocationImage(id, res);
  }

  async getRandomLocationsId(): Promise<Locations[]> {
    return this.locationRepository.getRandomLocationsId();
  }

  async getLocationById(id: string): Promise<Locations> {
    return this.locationRepository.getLocationById(id);
  }

  async deleteLocation(user: Users, id: string): Promise<Locations> {
    return this.locationRepository.deleteLocation(user, id);
  }

  async editLocation(
    user: Users,
    id: string,
    locationDto: LocationDto,
    file: Express.Multer.File,
  ): Promise<Locations> {
    return this.locationRepository.editLocation(user, id, locationDto, file);
  }
}
