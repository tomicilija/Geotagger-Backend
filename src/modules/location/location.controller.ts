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
export class LocationController {
  constructor(private locationService: LocationService) {}

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Get()
  async getLocations(): Promise<Locations[]> {
    return this.locationService.getLocations();
  }

  @Get('/random')
  async getRandomLocation(): Promise<Locations> {
    return this.locationService.getRandomLocation();
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Get('/:id')
  async getLocationById(@Param('id') id: string): Promise<Locations> {
    return this.locationService.getLocationById(id);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Post()
  async createLocation(
    @GetUser() user: Users,
    @Body() locationDto: LocationDto,
  ): Promise<Locations> {
    return this.locationService.createLocation(user, locationDto);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Delete('/:id')
  async deleteLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
  ): Promise<Locations> {
    return this.locationService.deleteLocation(user, id);
  }

  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @Patch('/:id')
  async editLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() locationDto: LocationDto,
  ): Promise<Locations> {
    return this.locationService.editLocation(user, id, locationDto);
  }
}
