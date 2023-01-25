import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Current user password',
    example: 'Passw123',
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description: 'New password',
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
    description: 'Confirm user password',
    example: 'Passw12345',
  })
  @IsNotEmpty()
  passwordConfirm: string;
}
