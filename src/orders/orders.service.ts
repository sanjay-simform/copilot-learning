import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './types/order.types';

@Injectable()
export class OrdersService {
  private readonly store = new Map<string, Order>();
  private orderCounter = 0;

  create(dto: CreateOrderDto): Order {
    const totalAmount = dto.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    const now = new Date();
    const orderNumber = this.generateOrderNumber();

    const order: Order = {
      id: randomUUID(),
      orderNumber,
      customerId: dto.customerId,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      items: dto.items,
      totalAmount,
      status: 'pending',
      notes: dto.notes,
      createdAt: now,
      updatedAt: now,
    };

    this.store.set(order.id, order);
    return order;
  }

  findAll(): Order[] {
    return [...this.store.values()];
  }

  findOne(id: string): Order {
    const order = this.store.get(id);
    if (!order) {
      throw new NotFoundException(`Order with id '${id}' not found`);
    }
    return order;
  }

  update(id: string, dto: UpdateOrderDto): Order {
    const order = this.findOne(id);

    let totalAmount = order.totalAmount;
    if (dto.items !== undefined) {
      totalAmount = dto.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
    }

    const updated: Order = {
      ...order,
      ...(dto.customerName !== undefined && { customerName: dto.customerName }),
      ...(dto.customerEmail !== undefined && {
        customerEmail: dto.customerEmail,
      }),
      ...(dto.items !== undefined && { items: dto.items }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
      ...(dto.items !== undefined && { totalAmount }),
      updatedAt: new Date(),
    };

    this.store.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id); // throws NotFoundException if missing
    this.store.delete(id);
  }

  /**
   * Generate a unique order number
   * Format: ORD-YYYYMMDD-XXXXX where XXXXX is a sequential counter
   */
  private generateOrderNumber(): string {
    this.orderCounter++;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const counter = String(this.orderCounter).padStart(5, '0');
    return `ORD-${dateStr}-${counter}`;
  }
}
