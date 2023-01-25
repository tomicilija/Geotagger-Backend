import { Repository } from 'typeorm';
import { Locations } from '../../entities/locations.entity';
import { LocationDto } from './dto/location.dto';
import { Users } from '../../entities/users.entity';
export declare class LocationRepository extends Repository<Locations> {
    private logger;
    getLocations(): Promise<Locations[]>;
    getRandomLocation(): Promise<Locations>;
    getLocationById(id: string): Promise<Locations>;
    createLocation(user: Users, locationDto: LocationDto): Promise<Locations>;
    deleteLocation(user: Users, id: string): Promise<Locations>;
    editLocation(user: Users, id: string, locationDto: LocationDto): Promise<Locations>;
}
