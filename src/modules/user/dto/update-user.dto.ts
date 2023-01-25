import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'New e-mail adress',
    example: 'name.surname@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'New first name',
    example: 'Name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'New Last/Family name',
    example: 'Surname',
  })
  @IsNotEmpty()
  surname: string;
}
