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

  async getLocations(): Promise<Locations[]> {
    return this.locationRepository.getLocations();
  }

  async getRandomLocation(): Promise<Locations> {
    return this.locationRepository.getRandomLocation();
  }

  async getLocationById(id: string): Promise<Locations> {
    return this.locationRepository.getLocationById(id);
  }
  async createLocation(
    user: Users,
    locationDto: LocationDto,
  ): Promise<Locations> {
    return this.locationRepository.createLocation(user, locationDto);
  }

  async deleteLocation(user: Users, id: string): Promise<Locations> {
    return this.locationRepository.deleteLocation(user, id);
  }

  async editLocation(
    user: Users,
    id: string,
    locationDto: LocationDto,
  ): Promise<Locations> {
    return this.locationRepository.editLocation(user, id, locationDto);
  }
}
