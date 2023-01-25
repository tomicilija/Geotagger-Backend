"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuessRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const guesses_entity_1 = require("../../entities/guesses.entity");
let GuessRepository = class GuessRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('GuessRepository');
    }
    async getGuesses(id) {
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
    async guessLocation(user, id, guessLocationDto) {
        const { latitude, longitude } = guessLocationDto;
        const location = await this.query('SELECT * FROM locations WHERE id = $1', [
            id,
        ]);
        if (!location) {
            this.logger.error(`Location not found!`);
            throw new common_1.NotFoundException(`Location not found!`);
        }
        const checkGuess = await this.findOne({
            where: {
                location_id: id,
                user_id: user.id,
            },
        });
        if (checkGuess) {
            this.logger.verbose(`User "${user.name} ${user.surname}" already submitet guess for this locaton`);
            throw new common_1.ConflictException(`User "${user.name} ${user.surname}" already submitet guess for this locaton`);
        }
        const distance = await this.calculateDistance(location[0].latitude, location[0].longitude, latitude, longitude);
        const guess = new guesses_entity_1.Guesses();
        guess.distance = distance;
        guess.user_id = user.id;
        guess.location_id = location[0].id;
        await this.save(guess);
        this.logger.verbose(`User "${user.name} ${user.surname}" added a new location "${location[0].name}" guess!`);
        return guess;
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
        const r = 6371e3;
        const distance = c * r;
        return distance >> 0;
    }
};
GuessRepository = __decorate([
    (0, typeorm_1.EntityRepository)(guesses_entity_1.Guesses)
], GuessRepository);
exports.GuessRepository = GuessRepository;
//# sourceMappingURL=guess.repository.js.map