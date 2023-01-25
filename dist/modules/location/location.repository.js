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
const path_1 = require("path");
const DEFAULT_IMAGE = 'DefaultAvatar.png';
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
let LocationRepository = class LocationRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('LocationRepository');
    }
    async createLocation(user, locationDto, file) {
        const { name, latitude, longitude } = locationDto;
        let locationImagePath = DEFAULT_IMAGE;
        if (file != undefined) {
            if (file.size < FILE_SIZE_LIMIT) {
                locationImagePath = file.filename;
            }
        }
        const location = new locations_entity_1.Locations();
        location.name = name;
        location.latitude = latitude;
        location.longitude = longitude;
        location.image = locationImagePath;
        location.user_id = user.id;
        await this.save(location);
        this.logger.verbose(`User with email ${user.email} added a new location "${name}"!`);
        return location;
    }
    async getLocations(page, size) {
        const getLocations = await this.find({
            order: {
                createdAt: 'DESC',
            },
            take: size,
        });
        return getLocations;
    }
    async getMyLocations(user, page, size) {
        const id = user.id;
        const getLocations = await this.createQueryBuilder()
            .where('user_id = :id', { id })
            .take(size)
            .getMany();
        return getLocations;
    }
    async getLocationImage(id, res) {
        const location = await this.findOne(id);
        if (!location) {
            this.logger.error(`Location wth ID: "${id}"" not found!`);
            throw new common_1.NotFoundException(`Location wth ID: "${id}" not found`);
        }
        const image = res.sendFile((0, path_1.join)(process.cwd(), 'uploads/locations/' + location.image));
        return image;
    }
    async getRandomLocationsId() {
        const totalLocations = await this.count();
        const offset = Math.floor(Math.random() * totalLocations);
        const getRandomLocation = this.createQueryBuilder()
            .select([
            'location.id',
        ])
            .from(locations_entity_1.Locations, 'location')
            .offset(offset)
            .limit(3)
            .getMany();
        return getRandomLocation;
    }
    async getLocationById(id) {
        const location = await this.findOne(id);
        if (!location) {
            this.logger.error(`Location with ID: ${id} not found!`);
            throw new common_1.NotFoundException(`Location with ID: ${id} not found!`);
        }
        this.logger.log(`Fetched location with ID: ${id} from the database!`);
        return location;
    }
    async deleteLocation(user, id) {
        const location = await this.findOne(id);
        if (!location) {
            this.logger.error(`Location with ID: ${id} not found!`);
            throw new common_1.NotFoundException(`Location with ID: ${id} not found!`);
        }
        if (location.user_id === user.id) {
            await this.query('DELETE FROM guesses WHERE location_id = $1', [
                location.id,
            ]);
            await this.remove(location);
            this.logger.verbose(`User with email: ${user.email} has successfully deleted location with id: ${id}!`);
            return location;
        }
        else {
            this.logger.error(`User with email: ${user.email} does not have permission to delete this location!`);
            throw new common_1.UnauthorizedException(`User with email: ${user.email} does not have permission to delete this location!`);
        }
    }
    async editLocation(user, id, locationDto, file) {
        const { name, latitude, longitude } = locationDto;
        const location = await this.findOne(id);
        if (!location) {
            this.logger.error(`Location with ID: ${id} not found!`);
            throw new common_1.NotFoundException(`Location with ID: ${id} not found!`);
        }
        let locationImagePath = DEFAULT_IMAGE;
        if (file != undefined) {
            if (file.size < FILE_SIZE_LIMIT) {
                locationImagePath = file.filename;
            }
        }
        if (location.user_id === user.id) {
            location.name = name;
            location.latitude = latitude;
            location.longitude = longitude;
            location.image = locationImagePath;
            await this.save(location);
            this.logger.log(`User with email: ${user.email} successfully edited the location with id ${id}!`);
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