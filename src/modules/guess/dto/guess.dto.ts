import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';

export class GuessDto {
    @ApiProperty({
        description: 'Guessed locaton coordiantes expressed as latitude',
        example: '46.231578',
      })
    @IsNotEmpty()
    @IsLatitude()
    latitude: number;
  
    @ApiProperty({
        description: 'Guessed locaton coordiantes expressed as longitude',
        example: '15.264089',
      })
    @IsNotEmpty()
    @IsLongitude()
    longitude: number;
  
}