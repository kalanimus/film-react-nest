// src/repository/films-memory.repository.ts
import { Injectable } from '@nestjs/common';
import { FilmDto, ScheduleDto } from '../films/dto/films.dto';
import { IFilmsRepository } from './films-repository.interface';

@Injectable()
export class FilmsMemoryRepository implements IFilmsRepository {
  private films: FilmDto[] = [
    {
      id: '0e33c7f6-27a7-4aa0-8e61-65d7e5effecf',
      rating: 2.9,
      director: 'Итан Райт',
      tags: ['Документальный'],
      image: '/bg1s.jpg',
      cover: '/bg1c.jpg',
      title: 'Архитекторы общества',
      about:
        'Документальный фильм, исследующий влияние искусственного интеллекта на общество.',
      description:
        'Документальный фильм Итана Райта исследует влияние технологий на современное общество.',
      schedule: [
        {
          id: 'f2e429b0-685d-41f8-a8cd-1d8cb63b99ce',
          daytime: '2024-06-28T10:00:53+03:00',
          hall: '0',
          rows: 5,
          seats: 10,
          price: 350,
          taken: [],
        },
      ],
    },
  ];

  async findAll(): Promise<FilmDto[]> {
    return this.films;
  }

  async findById(id: string): Promise<FilmDto | null> {
    return this.films.find((film) => film.id === id) || null;
  }

  async findSchedule(filmId: string): Promise<ScheduleDto[]> {
    const film = await this.findById(filmId);
    return film ? film.schedule : [];
  }

  async bookSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean> {
    const film = this.films.find((f) => f.id === filmId);
    if (!film) return false;

    const session = film.schedule.find((s) => s.id === sessionId);
    if (!session) return false;

    const seatKey = `${row}:${seat}`;
    if (session.taken.includes(seatKey)) return false;

    session.taken.push(seatKey);
    return true;
  }

  async findSession(filmId: string, sessionId: string): Promise<any> {
    const film = await this.findById(filmId);
    return film ? film.schedule.find((s) => s.id === sessionId) : null;
  }
}
