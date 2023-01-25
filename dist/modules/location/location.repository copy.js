"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRepository = void 0;
const typeorm_1 = require("typeorm");
const locations_entity_1 = require("../../entities/locations.entity");
const common_1 = require("@nestjs/common");
const guesses_entity_1 = require("../../entities/guesses.entity");
let LocationRepository = class LocationRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('LocationRepository');
    }
    async getLocations() {
        try {
            const getLocations = await this.createQueryBuilder()
                .select([
                'location.id',
                'location.latitude',
                'location.longitude',
                'location.image',
                'location.createdAt',
                'location.updatedAt',
                'location.user_id',
            ])
                .from(locations_entity_1.Locations, 'location')
                .orderBy('location.createdAt', 'DESC')
                .groupBy('location.id')
                .getMany();
            this.logger.verbose(`Fetched ${getLocations.length} locations from the database!`);
            return getLocations;
        }
        catch (error) {
            return error;
        }
    }
    async getRandomLocation() {
        try {
            const getRandomLocation = this.createQueryBuilder()
                .select([
                'location.id',
                'location.latitude',
                'location.longitude',
                'location.image',
                'location.createdAt',
                'location.updatedAt',
                'location.user_id',
            ])
                .from(locations_entity_1.Locations, 'location')
                .orderBy('RANDOM()')
                .limit(1)
                .getOne();
            this.logger.verbose(`Fetched random location from the database!`);
            return getRandomLocation;
        }
        catch (error) {
            return error;
        }
    }
    async getLocationById(id) {
        const location = await this.findOne({
            where: {
                id: id,
            },
        });
        if (!location) {
            this.logger.verbose(`Location not found!`);
            throw new common_1.NotFoundException(`Location not found!`);
        }
        return location;
    }
    async getGuesses(id) {
        try {
            const getGuesses = await this.createQueryBuilder()
                .select([
                'guess.id',
                'guess.distance',
                'guess.createdAt',
                'user.id',
                'user.name',
                'user.surname',
                'user.profile_picture',
            ])
                .from(guesses_entity_1.Guesses, 'guess')
                .leftJoin('guess.user_id', 'user')
                .where('guess.location_id = :id', { id })
                .orderBy('guess.distance', 'ASC')
                .getMany();
            this.logger.verbose(`Fetched ${getGuesses.length} guesses for location: ${id} from the database!`);
            return getGuesses;
        }
        catch (error) {
            return error;
        }
    }
    async createLocation(user, locationDto) {
        const { name, latitude, longitude, image } = locationDto;
        try {
            const location = new locations_entity_1.Locations();
            location.name = name;
            location.latitude = latitude;
            location.longitude = longitude;
            location.image = image;
            location.user_id = user.id;
            await this.save(location);
            this.logger.verbose(`User "${user.name} ${user.surname}" added a new location ${name}!`);
            return location;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async guessLocation(user, id, guessLocationDto) {
        console.log("3");
        const { latitude, longitude } = guessLocationDto;
        try {
            const location = await this.findOne({
                where: {
                    id: id,
                },
            });
            console.log("4");
            if (!location) {
                this.logger.error(`Location not found!`);
                throw new common_1.NotFoundException(`Location not found!`);
            }
            console.log("5");
            const distance = await this.calculateDistance(location.latitude, location.longitude, latitude, longitude);
            console.log("6");
            const guess = new guesses_entity_1.Guesses();
            guess.distance = distance;
            guess.user_id = user.id;
            guess.location_id = location.id;
            console.log("7");
            await this.save(guess);
            console.log("8");
            this.logger.verbose(`User "${user.name} ${user.surname}" added a new location "${location.name}" guess!`);
            console.log("9");
            return guess;
        }
        catch (error) {
            throw new common_1.UnauthorizedException();
        }
    }
    async deleteLocation(user, id) {
        try {
            const location = await this.findOne({
                where: {
                    id: id,
                },
            });
            if (location.user_id === user.id) {
                await this.remove(location);
                this.logger.verbose(`user with email: ${user.email} has successfully deleted location with id: ${id}!`);
                return location;
            }
            else {
                this.logger.error(`User with email: ${user.email} does not have permission to delete this location!`);
                throw new common_1.UnauthorizedException();
            }
        }
        catch (error) {
            return error;
        }
    }
    async editLocation(user, id, locationDto) {
        const { name, latitude, longitude, image } = locationDto;
        const location = await this.findOne({
            where: {
                id: id,
            },
        });
        if (location.user_id === user.id) {
            try {
                location.name = name;
                location.latitude = latitude;
                location.longitude = longitude;
                location.image = image;
                await this.save(location);
                this.logger.verbose(`User with email: ${user.email} successfully edited the location with id ${id}!`);
            }
            catch (error) {
                return error;
            }
        }
        else {
            this.logger.error(`User with email: ${user.email} does not have permission to edit this location!`);
            throw new common_1.UnauthorizedException();
        }
    }
    calculateDistance(lat1, lon1, lat2, lon2) {
        lon1 = (lon1 * Math.PI) / 180;
        lat1 = (lat1 * Math.PI) / 180;
        lon2 = (lon2 * Math.PI) / 180;
        lat2 = (lat2 * Math.PI) / 180;
        const dlon = lon2 - lon1;
        const dlat = lat2 - lat1;
        const a = Math.pow(Math.sin(dlat / 2), 2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
        const c = 2 * Math.asin(Math.sqrt(a));
        const r = 3956;
        const distance = c * r * 1000;
        return distance >> 0;
    }
};
LocationRepository = __decorate([
    (0, typeorm_1.EntityRepository)(locations_entity_1.Locations)
], LocationRepository);
exports.LocationRepository = LocationRepository;
//# sourceMappingURL=location.repository%20copy.js.map