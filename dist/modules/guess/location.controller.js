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
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const users_entity_1 = require("../../entities/users.entity");
const get_user_decorator_1 = require("../user/get-user.decorator");
const guess_location_dto_1 = require("./dto/guess-location.dto");
const location_dto_1 = require("./dto/location.dto");
const location_service_1 = require("./location.service");
let LocationController = class LocationController {
    constructor(locationService) {
        this.locationService = locationService;
    }
    async getLocations() {
        return this.locationService.getLocations();
    }
    async getRandomLocation() {
        return this.locationService.getRandomLocation();
    }
    async getLocationById(id) {
        return this.locationService.getLocationById(id);
    }
    async getGuesses(id) {
        return this.locationService.getGuesses(id);
    }
    async createLocation(user, locationDto) {
        return this.locationService.createLocation(user, locationDto);
    }
    async guessLocation(user, id, guessLocationDto) {
        return this.locationService.guessLocation(user, id, guessLocationDto);
    }
    async deleteLocation(user, id) {
        return this.locationService.deleteLocation(user, id);
    }
    async editLocation(user, id, locationDto) {
        return this.locationService.editLocation(user, id, locationDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getLocations", null);
__decorate([
    (0, common_1.Get)('/random'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getRandomLocation", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getLocationById", null);
__decorate([
    (0, common_1.Get)('/guesses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "getGuesses", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users,
        location_dto_1.LocationDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "createLocation", null);
__decorate([
    (0, common_1.Post)('/guess/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users, String, guess_location_dto_1.GuessLocationDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "guessLocation", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users, String]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "deleteLocation", null);
__decorate([
    (0, common_1.Patch)('/edit/:id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users, String, location_dto_1.LocationDto]),
    __metadata("design:returntype", Promise)
], LocationController.prototype, "editLocation", null);
LocationController = __decorate([
    (0, swagger_1.ApiTags)('Location'),
    (0, common_1.Controller)('location'),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], LocationController);
exports.LocationController = LocationController;
//# sourceMappingURL=location.controller.js.map