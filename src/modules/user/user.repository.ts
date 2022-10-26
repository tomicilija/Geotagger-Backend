import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, Logger, NotFoundException } from '@nestjs/common';
import { Users } from '../../entities/users.entity';
import { Guesses } from '../../entities/guesses.entity';
import { Locations } from '../../entities/locations.entity';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import * as bcrypt from 'bcrypt';

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

  // Updates all user information with taht id and all info in body (email, pass, name and surname)
  async updateUser(
    user: Users,
    userRegisterDto: UserRegisterDto,
  ): Promise<Users> {
    const {
      email,
      password,
      passwordConfirm,
      name,
      surname,
      profilePicture,
    } = userRegisterDto;
    const newUser = await this.findOne(user.id);
    const found = await this.find({
      where: { email: email },
    });

    if (found[0]) {
      this.logger.error(`User wth "${email}" email already exists!`);
      throw new ConflictException(
        `User wth "${email}" email already exists! \n`,
      );
    }

    // Do passwords match?
    if (password !== passwordConfirm) {
      this.logger.error(`Passwords do not match!`);
      throw new ConflictException('Passwords do not match!');
    } else {
      // Hash
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userRegisterDto.password, salt);

      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.name = name;
      newUser.surname = surname;
      newUser.profilePicture = profilePicture;

      await this.save(newUser);
      this.logger.verbose(`User with ${email} email is updated!`);
    }
    return newUser;
  }
}
