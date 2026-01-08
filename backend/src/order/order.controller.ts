import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const results = [];
    for (const ticket of createOrderDto.tickets) {
      const result = await this.orderService.create(ticket);
      results.push({
        id: Date.now().toString() + Math.random(),
        ...result,
      });
    }
    return {
      total: results.length,
      items: results,
    };
  }
}
