import { EntityRepository, Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from '../../entities/users.entity';
import { Guesses } from '../../entities/guesses.entity';
import { Locations } from '../../entities/locations.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { join } from 'path';
import { isUUID } from 'validator';
import { v4 as uuid } from 'uuid';
import * as nodemailer from 'nodemailer';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto copy';

const DEFAULT_AVATAR = 'DefaultAvatar.png';
const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5 MB

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {
  private logger = new Logger('UserRepository');

  // Gets all of the users information with this specific id
  async getLoggedInUser(user: Users): Promise<Users> {
    const found = await this.findOne(user.id);
    if (!found) {
      this.logger.error(`User wth emil: "${user.email}" not found!`);
      throw new NotFoundException(`User wth emil: "${user.email}" not found!`);
    }
    return found;
  }

  /* eslint-disable @typescript-eslint/camelcase*/
  // Gets user profile picture
  async getUserProfilePicture(user_id: string, res) {
    const found = await this.findOne(user_id);
    if (!found) {
      this.logger.error(`User wth ID: "${user_id}"" not found!`);
      throw new NotFoundException(`User wth ID: "${user_id}" not found`);
    }
    const profilePictures = res.sendFile(
      join(process.cwd(), 'uploads/profile-pictures/' + found.profilePicture),
    );
    return profilePictures;
  }

  // Gets all of the users information with this specific id
  async getUserById(user_id: string): Promise<Users> {
    if (isUUID(user_id)) {
      const found = await this.findOne(user_id);
      if (!found) {
        this.logger.error(`User wth ID: "${user_id}"" not found!`);
        throw new NotFoundException(`User wth ID: "${user_id}" not found`);
      }
      this.logger.verbose(
        `Fetched user with ${found.email} email by id from the database!`,
      );
      return found;
    }
  }
  /* eslint-enable @typescript-eslint/camelcase*/

  // Delete user with id
  async deleteUser(user: Users): Promise<void> {
    await this.createQueryBuilder()
      .delete()
      .from(Guesses)
      .where('user_id = :id', { id: user.id })
      .execute();
    this.logger.verbose(
      `User with ${user.email} email has successfully deleted all of their guesses!`,
    );
    await this.createQueryBuilder()
      .delete()
      .from(Locations)
      .where('user_id = :id', { id: user.id })
      .execute();
    this.logger.verbose(
      `User with email ${user.email} has successfully deleted all of their locations!`,
    );
    const result = await this.delete(user.id);
    if (result.affected == 0) {
      this.logger.error(`User with ID: "${user.id}" not fund!`);
      throw new NotFoundException(`User with ID: "${user.id}" not fund!`);
    }
    this.logger.verbose(
      `User with email ${user.email} has successfully deleted their account!`,
    );
  }

  // Updates information of loggend in user (email, name and surname)
  async updateUser(user: Users, updateUserDto: UpdateUserDto): Promise<Users> {
    const { email, name, surname } = updateUserDto;

    const newUser = await this.findOne(user.id);
    const found = await this.find({
      where: { email: email },
    });

    if (found[0] && user.email != email) {
      this.logger.error(`User wth "${email}" email already exists!`);
      throw new ConflictException(
        `User wth "${email}" email already exists! \n`,
      );
    }

    newUser.email = email;
    newUser.name = name;
    newUser.surname = surname;

    await this.save(newUser);
    this.logger.log(`User with ${email} email is updated!`);

    return newUser;
  }

  // Updates profile picture of loggend in user
  async updateProfilePicture(
    user: Users,
    file: Express.Multer.File,
  ): Promise<Users> {
    let profilePicturePath = DEFAULT_AVATAR;

    if (file != undefined) {
      if (file.size < FILE_SIZE_LIMIT) {
        profilePicturePath = file.filename;
      }
    }

    const newUser = await this.findOne(user.id);

    newUser.profilePicture = profilePicturePath;

    await this.save(newUser);
    this.logger.log(
      `User profile picutre with ${user.email} email is updated!`,
    );

    return newUser;
  }

  // Updates password of loggend in user
  async updatePassword(
    user: Users,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Users> {
    const { currentPassword, password, passwordConfirm } = updatePasswordDto;

    const newUser = await this.findOne(user.id);
    if (user && (await bcrypt.compare(currentPassword, user.password))) {
      // Do passwords match?
      if (password !== passwordConfirm) {
        this.logger.error(`Passwords do not match!`);
        throw new ConflictException('Passwords do not match!');
      } else {
        // Hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(
          updatePasswordDto.password,
          salt,
        );

        newUser.password = hashedPassword;

        await this.save(newUser);
        this.logger.verbose(`User password is updated!`);
      }
      return newUser;
    } else {
      this.logger.error(`Current password is  incorrect!`);
      throw new UnauthorizedException('Current password is incorrect!');
    }
  }

  async generateResetToken(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<string> {
    const email = forgotPasswordDto.email;
    const user = await this.findOne({ email });
    if (!user) {
      this.logger.error(`User with email: "${email}" not fund!`);
      throw new NotFoundException(`User with email: "${email}" not fund!`);
    }
    const resetToken = uuid();
    user.resetToken = resetToken;
    user.resetTokenExpiration = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await this.save(user);
    return resetToken;
  }

  private transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAPIO_USER,
      pass: process.env.MAILTRAPIO_PASSWORD,
    },
  });

  async sendResetEmail(
    forgotPasswordDto: ForgotPasswordDto,
    resetToken: string,
  ): Promise<void> {
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
      } else {
        this.logger.verbose(`Email with password reset token sent: ${info.response}`);
        return true;
      }
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
    const email = resetPasswordDto.email;
    const user = await this.findOne({ email });
    if (!user) {
      this.logger.error(`User with email: "${email}" not fund!`);
      throw new NotFoundException(`User with email: "${email}" not fund!`);
    } else if (user.resetToken !== resetPasswordDto.token) {
      this.logger.error(`Url does not match email adress!`);
      throw new BadRequestException(`Url does not match email adress!`);
    } else if (!user.resetTokenExpiration) {
      this.logger.error(
        `Url is invalid, send new request for password reset!`,
      );
      throw new BadRequestException(
        `Url is invalid, send new request for password reset!`,
      );
    } else if (user.resetTokenExpiration < new Date()) {
      this.logger.error(
        `Url is no longer valid, send new request for password reset!`,
      );
      throw new BadRequestException(
        `Url is no longer valid, send new request for password reset!`,
      );
    } else {
      if (resetPasswordDto.password !== resetPasswordDto.passwordConfirm) {
        this.logger.error(`Passwords do not match!`);
        throw new ConflictException('Passwords do not match!');
      } else {
        // Hash
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(
          resetPasswordDto.password,
          salt,
        );

        user.password = hashedPassword;

        user.resetToken = null;
        user.resetTokenExpiration = null;
        await this.save(user);
        this.logger.log(`User password has been reseted!`);
      }
      return true;
    }
  }
}
