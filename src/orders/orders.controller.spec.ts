import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  describe('create', () => {
    it('should create and return an order', () => {
      const createDto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440002',
            quantity: 2,
            unitPrice: 29.99,
          },
        ],
      };

      const result = controller.create(createDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.customerName).toBe(createDto.customerName);
      expect(result.status).toBe('pending');
    });
  });

  describe('findAll', () => {
    it('should return an array of orders', () => {
      const createDto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440002',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      controller.create(createDto);
      const result = controller.findAll();

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array when no orders exist', () => {
      const result = controller.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single order by id', () => {
      const createDto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440002',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const created = controller.create(createDto);
      const result = controller.findOne(created.id);

      expect(result).toEqual(created);
    });
  });

  describe('update', () => {
    it('should update and return the order', () => {
      const createDto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440002',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const created = controller.create(createDto);

      const updateDto: UpdateOrderDto = {
        status: 'shipped',
        customerName: 'Johnny Doe',
      };

      const result = controller.update(created.id, updateDto);

      expect(result.status).toBe('shipped');
      expect(result.customerName).toBe('Johnny Doe');
    });
  });

  describe('remove', () => {
    it('should delete the order and return undefined', () => {
      const createDto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440002',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const created = controller.create(createDto);
      const result = controller.remove(created.id);

      expect(result).toBeUndefined();
      expect(() => controller.findOne(created.id)).toThrow();
    });
  });
});
