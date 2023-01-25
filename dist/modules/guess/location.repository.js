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
let LocationRepository = class LocationRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('LocationRepository');
    }
    async getLocations() {
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
    async getRandomLocation() {
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
    async createLocation(user, locationDto) {
        const { name, latitude, longitude, image } = locationDto;
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
    async deleteLocation(user, id) {
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
    async editLocation(user, id, locationDto) {
        const { name, latitude, longitude, image } = locationDto;
        const location = await this.findOne({
            where: {
                id: id,
            },
        });
        if (location.user_id === user.id) {
            location.name = name;
            location.latitude = latitude;
            location.longitude = longitude;
            location.image = image;
            await this.save(location);
            this.logger.verbose(`User with email: ${user.email} successfully edited the location with id ${id}!`);
            return location;
        }
        else {
            this.logger.error(`User with email: ${user.email} does not have permission to edit this location!`);
            throw new common_1.UnauthorizedException();
        }
    }
};
LocationRepository = __decorate([
    (0, typeorm_1.EntityRepository)(locations_entity_1.Locations)
], LocationRepository);
exports.LocationRepository = LocationRepository;
//# sourceMappingURL=location.repository.js.map