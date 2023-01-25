import { Repository } from 'typeorm';
import { Locations } from '../../entities/locations.entity';
import { LocationDto } from './dto/location.dto';
import { Users } from '../../entities/users.entity';
import { Guesses } from 'src/entities/guesses.entity';
import { GuessLocationDto } from './dto/guess-location.dto';
export declare class LocationRepository extends Repository<Locations> {
    private logger;
    getLocations(): Promise<Locations[]>;
    getRandomLocation(): Promise<Locations>;
    getLocationById(id: string): Promise<Locations>;
    getGuesses(id: string): Promise<Guesses[]>;
    createLocation(user: Users, locationDto: LocationDto): Promise<Locations>;
    guessLocation(user: Users, id: string, guessLocationDto: GuessLocationDto): Promise<Guesses>;
    deleteLocation(user: Users, id: string): Promise<Locations>;
    editLocation(user: Users, id: string, locationDto: LocationDto): Promise<Locations>;
    calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any): number;
}
