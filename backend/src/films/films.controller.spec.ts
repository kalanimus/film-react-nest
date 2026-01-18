import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { ApiListResponse } from '../common/dto/api-response.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all films', async () => {
      const mockFilms = [
        { id: '1', title: 'Test Film', rating: 8.5 },
        { id: '2', title: 'Another Film', rating: 7.2 },
      ];

      mockFilmsService.findAll.mockResolvedValue(mockFilms);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBeInstanceOf(ApiListResponse);
      expect(result.total).toBe(2);
      expect(result.items).toEqual(mockFilms);
    });
  });

  describe('findFilmWithSchedule', () => {
    it('should return film schedule', async () => {
      const filmId = '123';
      const mockSchedule = [
        { id: '1', daytime: '2024-01-01 19:00', hall: 1, price: 500 },
        { id: '2', daytime: '2024-01-01 21:30', hall: 2, price: 600 },
      ];

      mockFilmsService.findSchedule.mockResolvedValue(mockSchedule);

      const result = await controller.findFilmWithSchedule(filmId);

      expect(service.findSchedule).toHaveBeenCalledWith(filmId);
      expect(result).toBeInstanceOf(ApiListResponse);
      expect(result.total).toBe(2);
      expect(result.items).toEqual(mockSchedule);
    });
  });
});
