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
exports.Users = void 0;
const typeorm_1 = require("typeorm");
const locations_entity_1 = require("./locations.entity");
const guesses_entity_1 = require("./guesses.entity");
const base_entity_1 = require("./base.entity");
let Users = class Users extends base_entity_1.CustomBaseEntity {
};
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "surname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Users.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Users.prototype, "resetToken", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Users.prototype, "resetTokenExpiration", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => locations_entity_1.Locations, locations => locations.user_id),
    __metadata("design:type", Array)
], Users.prototype, "locations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => guesses_entity_1.Guesses, guesses => guesses.user_id),
    __metadata("design:type", Array)
], Users.prototype, "guesses", void 0);
Users = __decorate([
    (0, typeorm_1.Entity)()
], Users);
exports.Users = Users;
//# sourceMappingURL=users.entity.js.map