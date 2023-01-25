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
exports.GuessController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const users_entity_1 = require("../../entities/users.entity");
const get_user_decorator_1 = require("../user/get-user.decorator");
const guess_dto_1 = require("./dto/guess.dto");
const guess_service_1 = require("./guess.service");
let GuessController = class GuessController {
    constructor(guessService) {
        this.guessService = guessService;
    }
    async getMyGuesses(user, page = 1, size = 3) {
        return this.guessService.getMyGuesses(user, page, size);
    }
    async getGuessById(id) {
        return this.guessService.getGuessById(id);
    }
    async guessLocation(user, id, guessnDto) {
        return this.guessService.guessLocation(user, id, guessnDto);
    }
};
__decorate([
    (0, common_1.Get)('/guesses/me'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('size')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users, Object, Object]),
    __metadata("design:returntype", Promise)
], GuessController.prototype, "getMyGuesses", null);
__decorate([
    (0, common_1.Get)('/guess/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GuessController.prototype, "getGuessById", null);
__decorate([
    (0, common_1.Post)('/guess/:id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users, String, guess_dto_1.GuessDto]),
    __metadata("design:returntype", Promise)
], GuessController.prototype, "guessLocation", null);
GuessController = __decorate([
    (0, swagger_1.ApiTags)('Guess'),
    (0, common_1.Controller)('location'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [guess_service_1.GuessService])
], GuessController);
exports.GuessController = GuessController;
//# sourceMappingURL=guess.controller.js.map