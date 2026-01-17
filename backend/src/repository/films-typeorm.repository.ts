import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { IFilmsRepository } from './films-repository.interface';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

@Injectable()
export class FilmsTypeOrmRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmRepository.find({ relations: ['schedule'] });
    return films.map((film) => ({
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags.startsWith('[') ? JSON.parse(film.tags) : [film.tags],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule:
        film.schedule?.map((s) => ({
          id: s.id,
          daytime: s.daytime,
          hall: s.hall.toString(),
          rows: s.rows,
          seats: s.seats,
          price: s.price,
          taken: s.taken.startsWith('[') ? JSON.parse(s.taken) : [],
        })) || [],
    }));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: ['schedule'],
    });
    if (!film) return null;

    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags.startsWith('[') ? JSON.parse(film.tags) : [film.tags],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule:
        film.schedule?.map((s) => ({
          id: s.id,
          daytime: s.daytime,
          hall: s.hall.toString(),
          rows: s.rows,
          seats: s.seats,
          price: s.price,
          taken: s.taken.startsWith('[') ? JSON.parse(s.taken) : [],
        })) || [],
    };
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[]> {
    const schedules = await this.scheduleRepository.find({
      where: { film: { id: filmId } },
    });

    return schedules.map((schedule) => ({
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall.toString(),
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken.startsWith('[') ? JSON.parse(schedule.taken) : [],
    }));
  }

  async bookSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
    });

    if (!schedule) return false;

    const taken =
      schedule.taken && schedule.taken.startsWith('[')
        ? JSON.parse(schedule.taken)
        : [];
    const seatKey = `${row}:${seat}`;

    if (taken.includes(seatKey)) return false;

    taken.push(seatKey);
    schedule.taken = JSON.stringify(taken);

    await this.scheduleRepository.save(schedule);
    return true;
  }

  async findSession(filmId: string, sessionId: string): Promise<any> {
    return await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
    });
  }
}
