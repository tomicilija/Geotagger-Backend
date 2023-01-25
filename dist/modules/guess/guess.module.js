"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuessModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("../auth/auth.module");
const guess_repository_1 = require("./guess.repository");
const guess_controller_1 = require("./guess.controller");
const guess_service_1 = require("./guess.service");
let GuessModule = class GuessModule {
};
GuessModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([guess_repository_1.GuessRepository]),
            auth_module_1.AuthModule,
        ],
        controllers: [guess_controller_1.GuessController],
        providers: [guess_service_1.GuessService],
    })
], GuessModule);
exports.GuessModule = GuessModule;
//# sourceMappingURL=guess.module.js.map