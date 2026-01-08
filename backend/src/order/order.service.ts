import {
  Injectable,
  BadRequestException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import { TicketDto } from './dto/order.dto';
import { IFilmsRepository } from '../repository/films-repository.interface';

@Injectable()
export class OrderService {
  constructor(
    @Inject('IFilmsRepository')
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async create(ticketDto: TicketDto): Promise<TicketDto> {
    const { film, session, row, seat } = ticketDto;

    const sessionData = await this.filmsRepository.findSession(film, session);
    if (!sessionData) {
      throw new BadRequestException('Session not found');
    }

    if (
      row < 1 ||
      row > sessionData.rows ||
      seat < 1 ||
      seat > sessionData.seats
    ) {
      throw new BadRequestException('Invalid seat position');
    }

    const booked = await this.filmsRepository.bookSeat(
      film,
      session,
      row,
      seat,
    );
    if (!booked) {
      throw new ConflictException('Seat already taken');
    }

    return ticketDto;
  }
}
