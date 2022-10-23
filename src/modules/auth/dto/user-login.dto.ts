import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    description: 'User e-mail adress',
    example: 'ilija.tomic@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Passw123',
  })
  @IsNotEmpty()
  password: string;
}
