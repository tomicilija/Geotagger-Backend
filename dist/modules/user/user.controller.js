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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const users_entity_1 = require("../../entities/users.entity");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_password_dto_1 = require("./dto/update-password.dto");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("./get-user.decorator");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const profile_images_storage_1 = require("../../common/storage/profile-images.storage");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const forgot_password_dto_copy_1 = require("./dto/forgot-password.dto copy");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getLoggedInUser(user) {
        return this.userService.getLoggedInUser(user);
    }
    getUserProfilePicture(user_id, res) {
        return this.userService.getUserProfilePicture(user_id, res);
    }
    getUserById(user_id) {
        return this.userService.getUserById(user_id);
    }
    deleteUser(user) {
        return this.userService.deleteUser(user);
    }
    updateUser(user, updateUserDto) {
        return this.userService.updateUser(user, updateUserDto);
    }
    updateProfilePicture(user, file) {
        return this.userService.updateProfilePicture(user, file);
    }
    updatePassword(user, updatePasswordDto) {
        return this.userService.updatePassword(user, updatePasswordDto);
    }
    async forgotPassword(forgotPasswordDto) {
        const resetToken = await this.userService.generateResetToken(forgotPasswordDto);
        await this.userService.sendResetEmail(forgotPasswordDto, resetToken);
    }
    async resetPassword(reserPasswordDto) {
        await this.userService.resetPassword(reserPasswordDto);
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getLoggedInUser", null);
__decorate([
    (0, common_1.Get)('/profilepicture/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserProfilePicture", null);
__decorate([
    (0, common_1.Get)('/:id'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Patch)('/update-user'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users,
        update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Patch)('/update-profilepicture'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture', profile_images_storage_1.profileImagesStorage)),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfilePicture", null);
__decorate([
    (0, common_1.Patch)('/update-password'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_entity_1.Users,
        update_password_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updatePassword", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_copy_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Patch)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('me'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map