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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guesses = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("./base.entity");
const locations_entity_1 = require("./locations.entity");
const users_entity_1 = require("./users.entity");
let Guesses = class Guesses extends base_entity_1.CustomBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Guesses.prototype, "distance", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Guesses.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Guesses.prototype, "location_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.Users, (user) => user.id, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", String)
], Guesses.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => locations_entity_1.Locations, (location) => location.id, { cascade: true }),
    (0, typeorm_1.JoinColumn)({ name: 'location_id' }),
    __metadata("design:type", String)
], Guesses.prototype, "location", void 0);
Guesses = __decorate([
    (0, typeorm_1.Entity)()
], Guesses);
exports.Guesses = Guesses;
//# sourceMappingURL=guesses.entity.js.map