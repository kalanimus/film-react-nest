import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, TicketDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create order with multiple tickets', async () => {
      const mockTicket: TicketDto = {
        film: 'Test Film',
        session: 'session-1',
        daytime: '2024-01-01 19:00',
        row: 5,
        seat: 10,
        price: 500,
      };

      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+1234567890',
        tickets: [mockTicket],
      };

      const mockResult = {
        film: 'Test Film',
        session: 'session-1',
        daytime: '2024-01-01 19:00',
        row: 5,
        seat: 10,
        price: 500,
      };

      mockOrderService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createOrderDto);

      expect(service.create).toHaveBeenCalledWith(mockTicket);
      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toMatchObject(mockResult);
      expect(result.items[0].id).toBeDefined();
    });

    it('should handle multiple tickets', async () => {
      const mockTickets: TicketDto[] = [
        {
          film: 'Film 1',
          session: 'session-1',
          daytime: '2024-01-01 19:00',
          row: 5,
          seat: 10,
          price: 500,
        },
        {
          film: 'Film 1',
          session: 'session-1',
          daytime: '2024-01-01 19:00',
          row: 5,
          seat: 11,
          price: 500,
        },
      ];

      const createOrderDto: CreateOrderDto = {
        email: 'test@example.com',
        phone: '+1234567890',
        tickets: mockTickets,
      };

      mockOrderService.create.mockResolvedValue(mockTickets[0]);

      const result = await controller.create(createOrderDto);

      expect(service.create).toHaveBeenCalledTimes(2);
      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });
  });
});
