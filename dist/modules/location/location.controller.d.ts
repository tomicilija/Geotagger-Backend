/// <reference types="multer" />
import { Locations } from '../../entities/locations.entity';
import { Users } from '../../entities/users.entity';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';
export declare class LocationController {
    private locationService;
    constructor(locationService: LocationService);
    createLocation(user: Users, locationDto: LocationDto, file: Express.Multer.File): Promise<Locations>;
    getLocations(page?: number, size?: number): Promise<Locations[]>;
    getMyLocations(user: Users, page?: number, size?: number): Promise<Locations[]>;
    getLocationImage(id: string, res: any): Promise<any>;
    getRandomLocationsId(): Promise<Locations[]>;
    getLocationById(id: string): Promise<Locations>;
    deleteLocation(user: Users, id: string): Promise<Locations>;
    editLocation(user: Users, id: string, locationDto: LocationDto, file: Express.Multer.File): Promise<Locations>;
}
