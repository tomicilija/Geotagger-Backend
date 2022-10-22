import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Locations } from '../../entities/locations.entity';
import { Users } from '../../entities/users.entity';
import { GetUser } from '../user/get-user.decorator';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@Controller('location')
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

  @Delete('/delete/:id')
  async deleteLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
  ): Promise<Locations> {
    return this.locationService.deleteLocation(user, id);
  }

  @Patch('/edit/:id')
  async editLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() LocationDto: LocationDto,
  ): Promise<Locations> {
    return this.locationService.editLocation(user, id, LocationDto);
  }
}
