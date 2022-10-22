import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class LocationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  image: string;
}
