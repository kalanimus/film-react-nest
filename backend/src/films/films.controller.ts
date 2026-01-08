import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { ApiListResponse } from '../common/dto/api-response.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll(): Promise<ApiListResponse<FilmDto>> {
    const films = await this.filmsService.findAll();
    return new ApiListResponse(films);
  }

  @Get(':id/schedule')
  async findFilmWithSchedule(
    @Param('id') id: string,
  ): Promise<ApiListResponse<ScheduleDto>> {
    const schedule = await this.filmsService.findSchedule(id);
    return new ApiListResponse(schedule);
  }
}
