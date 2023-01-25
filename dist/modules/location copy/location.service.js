"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const location_repository_1 = require("./location.repository");
const guess_repository_1 = require("./guess.repository");
let LocationService = class LocationService {
    constructor(locationRepository, guessRepository) {
        this.locationRepository = locationRepository;
        this.guessRepository = guessRepository;
    }
    async getLocations() {
        return this.locationRepository.getLocations();
    }
    async getRandomLocation() {
        return this.locationRepository.getRandomLocation();
    }
    async getLocationById(id) {
        return this.locationRepository.getLocationById(id);
    }
    async getGuesses(id) {
        return this.guessRepository.getGuesses(id);
    }
    async createLocation(user, locationDto) {
        return this.locationRepository.createLocation(user, locationDto);
    }
    async guessLocation(user, id, guessLocationDto) {
        return this.guessRepository.guessLocation(user, id, guessLocationDto);
    }
    async deleteLocation(user, id) {
        return this.locationRepository.deleteLocation(user, id);
    }
    async editLocation(user, id, locationDto) {
        return this.locationRepository.editLocation(user, id, locationDto);
    }
};
LocationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(location_repository_1.LocationRepository)),
    __param(1, (0, typeorm_1.InjectRepository)(guess_repository_1.GuessRepository)),
    __metadata("design:paramtypes", [location_repository_1.LocationRepository,
        guess_repository_1.GuessRepository])
], LocationService);
exports.LocationService = LocationService;
//# sourceMappingURL=location.service.js.map