"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const users_entity_1 = require("../../entities/users.entity");
const bcrypt = require("bcrypt");
const DEFAULT_AVATAR = 'DefaultAvatar.png';
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
let AuthRepository = class AuthRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('AuthRepository');
    }
    async register(userRegisterDto, file) {
        const { email, password, passwordConfirm, name, surname } = userRegisterDto;
        let profilePicturePath = DEFAULT_AVATAR;
        if (file != undefined) {
            if (file.size < FILE_SIZE_LIMIT) {
                profilePicturePath = file.filename;
            }
        }
        if (password !== passwordConfirm) {
            this.logger.error(`Passwords do not match!`);
            throw new common_1.ConflictException('Passwords do not match!');
        }
        else {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = this.create({
                email,
                password: hashedPassword,
                name,
                surname,
                profilePicture: profilePicturePath,
            });
            try {
                await this.save(user);
                this.logger.log(`User with ${email} email is saved in a database!`);
            }
            catch (error) {
                if (error.code === '23505') {
                    this.logger.error(`User is already registerd with "${email}" email!`);
                    throw new common_1.ConflictException(`User is already registerd with "${email}" email!`);
                }
                else {
                    throw new common_1.InternalServerErrorException(error);
                }
            }
        }
    }
};
AuthRepository = __decorate([
    (0, typeorm_1.EntityRepository)(users_entity_1.Users)
], AuthRepository);
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map