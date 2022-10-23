import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({
    description: 'User e-mail adress',
    example: 'ilija.tomic@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Passw123',
  })
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be longer than or equal to 8 characters\n',
  })
  // Passwords will contain at least 1 upper case letter
  // Passwords will contain at least 1 lower case letter
  // Passwords will contain at least 1 number or special character
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Password is too weak (Must contain: at least 1 upper case letter, least 1 lower case letter, 1 number or special character)\n',
  })
  password: string;

  @ApiProperty({
    description: 'Confirm user password',
    example: 'Passw123',
  })
  @IsNotEmpty()
  passwordConfirm: string;

  @ApiProperty({
    description: 'First name',
    example: 'Ilija',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Last/Family name',
    example: 'Tomic',
  })
  @IsNotEmpty()
  surname: string;

  @ApiProperty({
    description: 'Path of a profile picture',
    example: 'path/DefaultPicture',
  })
  @IsNotEmpty()
  profilePicture: string;
}
