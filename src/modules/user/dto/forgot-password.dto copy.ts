import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Users Email Adress',
    example: 'name.surname@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

