import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Users Email Adress',
    example: 'name.surname@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Recived token',
    example: 'a8b16ae1-1c1f-4967-98fd-0038306a1667',
  })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'New user password',
    example: 'Passw12345',
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
    description: 'Confirm New user password',
    example: 'Passw12345',
  })
  @IsNotEmpty()
  passwordConfirm: string;
}

