import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Users } from '../../entities/users.entity';
import { Guesses } from '../../entities/guesses.entity';
import { Locations } from '../../entities/locations.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcrypt';
import { join } from 'path';

@EntityRepository(Users)
export class UserRepository extends Repository<Users> {
  private logger = new Logger('LocationRepository');

  // Gets all of the users information with this specific id
  async getLoggedInUser(user: Users): Promise<Users> {
    const found = await this.findOne(user.id);
    if (!found) {
      this.logger.error(`User wth emil: "${user.email}" not found!`);
      throw new NotFoundException(`User wth emil: "${user.email}" not found!`);
    }
    this.logger.verbose(
      `Fetched user "${found.name} ${found.surname}" from the database!`,
    );
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
    const found = await this.findOne(user_id);
    if (!found) {
      this.logger.error(`User wth ID: "${user_id}"" not found!`);
      throw new NotFoundException(`User wth ID: "${user_id}" not found`);
    }
    this.logger.verbose(
      `Fetched user "${found.name} ${found.surname}" from the database!`,
    );
    return found;
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
      `User with email: ${user.email} has successfully deleted all of their guesses!`,
    );
    await this.createQueryBuilder()
      .delete()
      .from(Locations)
      .where('user_id = :id', { id: user.id })
      .execute();
    this.logger.verbose(
      `User with email: ${user.email} has successfully deleted all of their locations!`,
    );
    const result = await this.delete(user.id);
    if (result.affected == 0) {
      this.logger.error(`User with ID: "${user.id}" not fund!`);
      throw new NotFoundException(`User with ID: "${user.id}" not fund!`);
    }
    this.logger.verbose(
      `User with email: ${user.email} has successfully deleted their profile!`,
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
    this.logger.verbose(`User with ${email} email is updated!`);

    return newUser;
  }
  // Updates profile picture of loggend in user
  async updateProfilePicture(
    user: Users,
    file: Express.Multer.File,
  ): Promise<Users> {
    const fileSize = 5 * 1024 * 1024; // 5 MB
    let profilePicturePath = 'DefaultAvatar.png';

    if (file != undefined) {
      if (file.size < fileSize) {
        profilePicturePath = file.filename;
      }
    }

    const newUser = await this.findOne(user.id);

    newUser.profilePicture = profilePicturePath;

    await this.save(newUser);
    this.logger.verbose(
      `User profile picutre with ${user.email} email is updated!`,
    );

    return newUser;
  }

  // Updates password of loggend in user
  async updatePassword(
    user: Users,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<Users> {
    const {currentPassword, password, passwordConfirm } = updatePasswordDto;

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
      this.logger.verbose(`Current password is  incorrect!`);
      throw new UnauthorizedException('Current password is incorrect!');
    }
  }
}
