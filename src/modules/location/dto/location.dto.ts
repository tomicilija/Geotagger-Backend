import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LocationDto {
  @ApiProperty({
    description: 'Location name or adress',
    example: 'Velenje',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Location coordiantes expressed as latitude',
    example: '46.356637',
  })
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    description: 'Location coordiantes expressed as longitude',
    example: '15.131544',
  })
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;

  @ApiProperty({
    description: 'Path to image that shows location for users to guess',
    example: 'path/locationImage',
  })
  @IsNotEmpty()
  image: string;
}
