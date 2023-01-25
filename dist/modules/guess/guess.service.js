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
exports.GuessService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const guess_repository_1 = require("./guess.repository");
let GuessService = class GuessService {
    constructor(guessRepository) {
        this.guessRepository = guessRepository;
    }
    async getMyGuesses(user, page, size) {
        return this.guessRepository.getMyGuesses(user, page, size);
    }
    async getGuessById(id) {
        return this.guessRepository.getGuessById(id);
    }
    async guessLocation(user, id, guessnDto) {
        return this.guessRepository.guessLocation(user, id, guessnDto);
    }
};
GuessService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(guess_repository_1.GuessRepository)),
    __metadata("design:paramtypes", [guess_repository_1.GuessRepository])
], GuessService);
exports.GuessService = GuessService;
//# sourceMappingURL=guess.service.js.map