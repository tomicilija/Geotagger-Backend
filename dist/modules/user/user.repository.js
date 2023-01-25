"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const users_entity_1 = require("../../entities/users.entity");
const guesses_entity_1 = require("../../entities/guesses.entity");
const locations_entity_1 = require("../../entities/locations.entity");
const bcrypt = require("bcrypt");
const path_1 = require("path");
const validator_1 = require("validator");
const uuid_1 = require("uuid");
const nodemailer = require("nodemailer");
const DEFAULT_AVATAR = 'DefaultAvatar.png';
const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
let UserRepository = class UserRepository extends typeorm_1.Repository {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('UserRepository');
        this.transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAILTRAPIO_USER,
                pass: process.env.MAILTRAPIO_PASSWORD,
            },
        });
    }
    async getLoggedInUser(user) {
        const found = await this.findOne(user.id);
        if (!found) {
            this.logger.error(`User wth emil: "${user.email}" not found!`);
            throw new common_1.NotFoundException(`User wth emil: "${user.email}" not found!`);
        }
        return found;
    }
    async getUserProfilePicture(user_id, res) {
        const found = await this.findOne(user_id);
        if (!found) {
            this.logger.error(`User wth ID: "${user_id}"" not found!`);
            throw new common_1.NotFoundException(`User wth ID: "${user_id}" not found`);
        }
        const profilePictures = res.sendFile((0, path_1.join)(process.cwd(), 'uploads/profile-pictures/' + found.profilePicture));
        return profilePictures;
    }
    async getUserById(user_id) {
        if ((0, validator_1.isUUID)(user_id)) {
            const found = await this.findOne(user_id);
            if (!found) {
                this.logger.error(`User wth ID: "${user_id}"" not found!`);
                throw new common_1.NotFoundException(`User wth ID: "${user_id}" not found`);
            }
            this.logger.verbose(`Fetched user with ${found.email} email by id from the database!`);
            return found;
        }
    }
    async deleteUser(user) {
        await this.createQueryBuilder()
            .delete()
            .from(guesses_entity_1.Guesses)
            .where('user_id = :id', { id: user.id })
            .execute();
        this.logger.verbose(`User with ${user.email} email has successfully deleted all of their guesses!`);
        await this.createQueryBuilder()
            .delete()
            .from(locations_entity_1.Locations)
            .where('user_id = :id', { id: user.id })
            .execute();
        this.logger.verbose(`User with email ${user.email} has successfully deleted all of their locations!`);
        const result = await this.delete(user.id);
        if (result.affected == 0) {
            this.logger.error(`User with ID: "${user.id}" not fund!`);
            throw new common_1.NotFoundException(`User with ID: "${user.id}" not fund!`);
        }
        this.logger.verbose(`User with email ${user.email} has successfully deleted their account!`);
    }
    async updateUser(user, updateUserDto) {
        const { email, name, surname } = updateUserDto;
        const newUser = await this.findOne(user.id);
        const found = await this.find({
            where: { email: email },
        });
        if (found[0] && user.email != email) {
            this.logger.error(`User wth "${email}" email already exists!`);
            throw new common_1.ConflictException(`User wth "${email}" email already exists! \n`);
        }
        newUser.email = email;
        newUser.name = name;
        newUser.surname = surname;
        await this.save(newUser);
        this.logger.log(`User with ${email} email is updated!`);
        return newUser;
    }
    async updateProfilePicture(user, file) {
        let profilePicturePath = DEFAULT_AVATAR;
        if (file != undefined) {
            if (file.size < FILE_SIZE_LIMIT) {
                profilePicturePath = file.filename;
            }
        }
        const newUser = await this.findOne(user.id);
        newUser.profilePicture = profilePicturePath;
        await this.save(newUser);
        this.logger.log(`User profile picutre with ${user.email} email is updated!`);
        return newUser;
    }
    async updatePassword(user, updatePasswordDto) {
        const { currentPassword, password, passwordConfirm } = updatePasswordDto;
        const newUser = await this.findOne(user.id);
        if (user && (await bcrypt.compare(currentPassword, user.password))) {
            if (password !== passwordConfirm) {
                this.logger.error(`Passwords do not match!`);
                throw new common_1.ConflictException('Passwords do not match!');
            }
            else {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(updatePasswordDto.password, salt);
                newUser.password = hashedPassword;
                await this.save(newUser);
                this.logger.verbose(`User password is updated!`);
            }
            return newUser;
        }
        else {
            this.logger.error(`Current password is  incorrect!`);
            throw new common_1.UnauthorizedException('Current password is incorrect!');
        }
    }
    async generateResetToken(forgotPasswordDto) {
        const email = forgotPasswordDto.email;
        const user = await this.findOne({ email });
        if (!user) {
            this.logger.error(`User with email: "${email}" not fund!`);
            throw new common_1.NotFoundException(`User with email: "${email}" not fund!`);
        }
        const resetToken = (0, uuid_1.v4)();
        user.resetToken = resetToken;
        user.resetTokenExpiration = new Date(Date.now() + 1 * 60 * 60 * 1000);
        await this.save(user);
        return resetToken;
    }
    async sendResetEmail(forgotPasswordDto, resetToken) {
        const email = forgotPasswordDto.email;
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        const message = {
            from: 'reset-password@geotagger.com',
            to: email,
            subject: 'Reset your Geotagger password',
            text: `Click the link to reset your password: ${resetLink}`,
            html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
        };
        await this.transporter.sendMail(message, (error, info) => {
            if (error) {
                this.logger.error(error);
                throw new Error(error);
            }
            else {
                this.logger.verbose(`Email with password reset token sent: ${info.response}`);
                return true;
            }
        });
    }
    async resetPassword(resetPasswordDto) {
        const email = resetPasswordDto.email;
        const user = await this.findOne({ email });
        if (!user) {
            this.logger.error(`User with email: "${email}" not fund!`);
            throw new common_1.NotFoundException(`User with email: "${email}" not fund!`);
        }
        else if (user.resetToken !== resetPasswordDto.token) {
            this.logger.error(`Url does not match email adress!`);
            throw new common_1.BadRequestException(`Url does not match email adress!`);
        }
        else if (!user.resetTokenExpiration) {
            this.logger.error(`Url is invalid, send new request for password reset!`);
            throw new common_1.BadRequestException(`Url is invalid, send new request for password reset!`);
        }
        else if (user.resetTokenExpiration < new Date()) {
            this.logger.error(`Url is no longer valid, send new request for password reset!`);
            throw new common_1.BadRequestException(`Url is no longer valid, send new request for password reset!`);
        }
        else {
            if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
                this.logger.error(`Passwords do not match!`);
                throw new common_1.ConflictException('Passwords do not match!');
            }
            else {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(resetPasswordDto.password, salt);
                user.password = hashedPassword;
                user.resetToken = null;
                user.resetTokenExpiration = null;
                await this.save(user);
                this.logger.log(`User password has been reseted!`);
            }
            return true;
        }
    }
};
UserRepository = __decorate([
    (0, typeorm_1.EntityRepository)(users_entity_1.Users)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map