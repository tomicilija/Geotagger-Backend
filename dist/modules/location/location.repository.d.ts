/// <reference types="multer" />
import { Repository } from 'typeorm';
import { Locations } from '../../entities/locations.entity';
import { LocationDto } from './dto/location.dto';
import { Users } from '../../entities/users.entity';
export declare class LocationRepository extends Repository<Locations> {
    private logger;
    createLocation(user: Users, locationDto: LocationDto, file: Express.Multer.File): Promise<Locations>;
    getLocations(page: number, size: number): Promise<Locations[]>;
    getMyLocations(user: Users, page: number, size: number): Promise<Locations[]>;
    getLocationImage(id: string, res: any): Promise<any>;
    getRandomLocationsId(): Promise<Locations[]>;
    getLocationById(id: string): Promise<Locations>;
    deleteLocation(user: Users, id: string): Promise<Locations>;
    editLocation(user: Users, id: string, locationDto: LocationDto, file: Express.Multer.File): Promise<Locations>;
}
