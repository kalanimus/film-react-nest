import { Injectable, Inject } from '@nestjs/common';
import { FilmDto, ScheduleDto } from './dto/films.dto';
import { IFilmsRepository } from '../repository/films-repository.interface';

@Injectable()
export class FilmsService {
  constructor(
    @Inject('IFilmsRepository')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    return this.filmsRepository.findAll();
  }

  async findById(id: string): Promise<FilmDto | null> {
    return this.filmsRepository.findById(id);
  }

  async findSchedule(id: string): Promise<ScheduleDto[]> {
    return this.filmsRepository.findSchedule(id);
  }
}
