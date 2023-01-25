import { Guesses } from '../../entities/guesses.entity';
import { Locations } from '../../entities/locations.entity';
import { Users } from '../../entities/users.entity';
import { GuessLocationDto } from './dto/guess-location.dto';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';
export declare class LocationController {
    private locationService;
    constructor(locationService: LocationService);
    getLocations(): Promise<Locations[]>;
    getRandomLocation(): Promise<Locations>;
    getLocationById(id: string): Promise<Locations>;
    getGuesses(id: string): Promise<Guesses[]>;
    createLocation(user: Users, locationDto: LocationDto): Promise<Locations>;
    guessLocation(user: Users, id: string, guessLocationDto: GuessLocationDto): Promise<Guesses>;
    deleteLocation(user: Users, id: string): Promise<Locations>;
    editLocation(user: Users, id: string, locationDto: LocationDto): Promise<Locations>;
}
