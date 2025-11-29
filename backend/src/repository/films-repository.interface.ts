import { FilmDto, ScheduleDto } from '../films/dto/films.dto';

export interface IFilmsRepository {
  findAll(): Promise<FilmDto[]>;
  findById(id: string): Promise<FilmDto | null>;
  findSchedule(filmId: string): Promise<ScheduleDto[]>;
  bookSeat(
    filmId: string,
    sessionId: string,
    row: number,
    seat: number,
  ): Promise<boolean>;
  findSession(filmId: string, sessionId: string): Promise<any>;
}
