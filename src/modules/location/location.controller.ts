import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Locations } from '../../entities/locations.entity';
import { Users } from '../../entities/users.entity';
import { GetUser } from '../user/get-user.decorator';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@ApiTags('Location')
@Controller('location')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Get()
  async getLocations(): Promise<Locations[]> {
    return this.locationService.getLocations();
  }

  @Get('/random')
  async getRandomLocation(): Promise<Locations> {
    return this.locationService.getRandomLocation();
  }

  @Get('/:id')
  async getLocationById(@Param('id') id: string): Promise<Locations> {
    return this.locationService.getLocationById(id);
  }

  @Post()
  async createLocation(
    @GetUser() user: Users,
    @Body() locationDto: LocationDto,
  ): Promise<Locations> {
    return this.locationService.createLocation(user, locationDto);
  }

  @Delete('/:id')
  async deleteLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
  ): Promise<Locations> {
    return this.locationService.deleteLocation(user, id);
  }

  @Patch('/:id')
  async editLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() locationDto: LocationDto,
  ): Promise<Locations> {
    return this.locationService.editLocation(user, id, locationDto);
  }
}
