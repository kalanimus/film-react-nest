import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../films/schemas/film.schema';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { IFilmsRepository } from './films-repository.interface';

@Injectable()
export class FilmsMongoRepository implements IFilmsRepository {
  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {}

  async findAll(): Promise<FilmDto[]> {
    const films = await this.filmModel.find().exec();
    return films.map((film) => this.toFilmDto(film));
  }

  async findById(id: string): Promise<FilmDto | null> {
    const film = await this.filmModel.findOne({ id }).exec();
    return film ? this.toFilmDto(film) : null;
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.filmModel.findOne({ id: filmId }).exec();
    return film ? film.schedule.map((s) => this.toScheduleDto(s)) : [];
  }

  async bookSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const seatKey = `${row}:${seat}`;
    const result = await this.filmModel
      .updateOne(
        {
          id: filmId,
          'schedule.id': sessionId,
          'schedule.taken': { $ne: seatKey },
        },
        {
          $push: { 'schedule.$.taken': seatKey },
        },
      )
      .exec();
    return result.modifiedCount > 0;
  }

  async findSession(filmId: string, sessionId: string) {
    const film = await this.filmModel
      .findOne({ id: filmId }, { 'schedule.$': 1 })
      .where('schedule.id')
      .equals(sessionId)
      .exec();
    return film?.schedule[0] || null;
  }

  private toFilmDto(film: Film): FilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags,
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
      schedule: film.schedule.map((s) => this.toScheduleDto(s)),
    };
  }

  private toScheduleDto(schedule: any): ScheduleDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall.toString(),
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }
}
