import { NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import type { OrderItem } from './types/order.types';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    service = new OrdersService();
  });

  describe('create', () => {
    it('should create a new order with auto-generated order number', () => {
      const dto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 2,
            unitPrice: 29.99,
          },
        ],
      };

      const order = service.create(dto);

      expect(order).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.orderNumber).toMatch(/^ORD-\d{8}-\d{5}$/);
      expect(order.customerId).toBe(dto.customerId);
      expect(order.customerName).toBe(dto.customerName);
      expect(order.customerEmail).toBe(dto.customerEmail);
      expect(order.totalAmount).toBe(59.98);
      expect(order.status).toBe('pending');
      expect(order.createdAt).toBeInstanceOf(Date);
      expect(order.updatedAt).toBeInstanceOf(Date);
    });

    it('should calculate totalAmount correctly for multiple items', () => {
      const dto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 2,
            unitPrice: 10,
          },
          {
            productId: '550e8400-e29b-41d4-a716-446655440002',
            quantity: 3,
            unitPrice: 20,
          },
        ],
      };

      const order = service.create(dto);

      expect(order.totalAmount).toBe(80);
    });

    it('should include optional notes in order', () => {
      const dto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 1,
            unitPrice: 50,
          },
        ],
        notes: 'Special delivery requested',
      };

      const order = service.create(dto);

      expect(order.notes).toBe('Special delivery requested');
    });
  });

  describe('findAll', () => {
    it('should return all orders', () => {
      const dto1: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const dto2: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440002',
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440003',
            quantity: 2,
            unitPrice: 30,
          },
        ],
      };

      service.create(dto1);
      service.create(dto2);

      const orders = service.findAll();

      expect(orders).toHaveLength(2);
    });

    it('should return empty array when no orders exist', () => {
      const orders = service.findAll();

      expect(orders).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should find order by id', () => {
      const dto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const created = service.create(dto);
      const found = service.findOne(created.id);

      expect(found).toEqual(created);
    });

    it('should throw NotFoundException for non-existent order', () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => service.findOne(fakeId)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update order customer information', () => {
      const dto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const created = service.create(dto);

      const updateDto: UpdateOrderDto = {
        customerName: 'Johnny Doe',
        customerEmail: 'johnny@example.com',
      };

      const updated = service.update(created.id, updateDto);

      expect(updated.customerName).toBe('Johnny Doe');
      expect(updated.customerEmail).toBe('johnny@example.com');
      expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(
        created.updatedAt.getTime(),
      );
    });

    it('should update order status', () => {
      const dto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const created = service.create(dto);

      const updateDto: UpdateOrderDto = {
        status: 'shipped',
      };

      const updated = service.update(created.id, updateDto);

      expect(updated.status).toBe('shipped');
    });

    it('should update order items and recalculate total amount', () => {
      const dto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const created = service.create(dto);

      const newItems: OrderItem[] = [
        {
          productId: '550e8400-e29b-41d4-a716-446655440001',
          quantity: 2,
          unitPrice: 100,
        },
      ];

      const updateDto: UpdateOrderDto = {
        items: newItems,
      };

      const updated = service.update(created.id, updateDto);

      expect(updated.totalAmount).toBe(200);
    });

    it('should throw NotFoundException when updating non-existent order', () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';
      const updateDto: UpdateOrderDto = {
        status: 'delivered',
      };

      expect(() => service.update(fakeId, updateDto)).toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove order by id', () => {
      const dto: CreateOrderDto = {
        customerId: '550e8400-e29b-41d4-a716-446655440000',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          {
            productId: '550e8400-e29b-41d4-a716-446655440001',
            quantity: 1,
            unitPrice: 50,
          },
        ],
      };

      const created = service.create(dto);
      service.remove(created.id);

      expect(() => service.findOne(created.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when removing non-existent order', () => {
      const fakeId = '550e8400-e29b-41d4-a716-446655440000';

      expect(() => service.remove(fakeId)).toThrow(NotFoundException);
    });
  });
});
