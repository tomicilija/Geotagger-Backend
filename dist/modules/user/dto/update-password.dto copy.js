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
exports.UserRegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UserRegisterDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User e-mail adress',
        example: 'name.surname@gmail.com',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User password',
        example: 'Passw123',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(8, {
        message: 'Password must be longer than or equal to 8 characters\n',
    }),
    (0, class_validator_1.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Password is too weak (Must contain: at least 1 upper case letter, least 1 lower case letter, 1 number or special character)\n',
    }),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Confirm user password',
        example: 'Passw123',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "passwordConfirm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'First name',
        example: 'Name',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last/Family name',
        example: 'Surname',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UserRegisterDto.prototype, "surname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Path of a profile picture',
        example: 'DefaultAvatar.png',
        type: 'file'
    }),
    __metadata("design:type", Object)
], UserRegisterDto.prototype, "profilePicture", void 0);
exports.UserRegisterDto = UserRegisterDto;
//# sourceMappingURL=update-password.dto%20copy.js.map