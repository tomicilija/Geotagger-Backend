import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { locationImagesStorage } from 'src/common/storage/location-images.storage';
import { Locations } from '../../entities/locations.entity';
import { Users } from '../../entities/users.entity';
import { GetUser } from '../user/get-user.decorator';
import { LocationDto } from './dto/location.dto';
import { LocationService } from './location.service';

@ApiTags('Location')
@Controller('location')
export class LocationController {
  constructor(private locationService: LocationService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', locationImagesStorage))
  async createLocation(
    @GetUser() user: Users,
    @Body() locationDto: LocationDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Locations> {
    return this.locationService.createLocation(user, locationDto, file);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async getLocations(
    @Query('page') page = 1,
    @Query('size') size = 3,
  ): Promise<Locations[]> {
    return this.locationService.getLocations(page, size);
  }

  // Gets all locations of signed in user
  @Get('/me')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async getMyLocations(
    @GetUser() user: Users,
    @Query('page') page = 1,
    @Query('size') size = 3,
  ): Promise<Locations[]> {
    return this.locationService.getMyLocations(user, page, size);
  }

  // Gets location image
  @Get('/image/:id')
  getLocationImage(@Param('id') id: string, @Res() res) {
    return this.locationService.getLocationImage(id, res);
  }

  @Get('/random')
  async getRandomLocationsId(): Promise<Locations[]> {
    return this.locationService.getRandomLocationsId();
  }

  @Get('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async getLocationById(@Param('id') id: string): Promise<Locations> {
    return this.locationService.getLocationById(id);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async deleteLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
  ): Promise<Locations> {
    return this.locationService.deleteLocation(user, id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', locationImagesStorage))
  async editLocation(
    @GetUser() user: Users,
    @Param('id') id: string,
    @Body() locationDto: LocationDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Locations> {
    return this.locationService.editLocation(user, id, locationDto, file);
  }
}
