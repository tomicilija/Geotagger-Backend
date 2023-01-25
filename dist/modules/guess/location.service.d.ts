import { LocationRepository } from './location.repository';
import { Locations } from '../../entities/locations.entity';
import { LocationDto } from './dto/location.dto';
import { Users } from '../../entities/users.entity';
import { GuessLocationDto } from './dto/guess-location.dto';
import { Guesses } from '../../entities/guesses.entity';
import { GuessRepository } from './guess.repository';
export declare class LocationService {
    private locationRepository;
    private guessRepository;
    constructor(locationRepository: LocationRepository, guessRepository: GuessRepository);
    getLocations(): Promise<Locations[]>;
    getRandomLocation(): Promise<Locations>;
    getLocationById(id: string): Promise<Locations>;
    getGuesses(id: string): Promise<Guesses[]>;
    createLocation(user: Users, locationDto: LocationDto): Promise<Locations>;
    guessLocation(user: Users, id: string, guessLocationDto: GuessLocationDto): Promise<Guesses>;
    deleteLocation(user: Users, id: string): Promise<Locations>;
    editLocation(user: Users, id: string, locationDto: LocationDto): Promise<Locations>;
}
