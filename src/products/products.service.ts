import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './types/product.types';

@Injectable()
export class ProductsService {
  private readonly store = new Map<string, Product>();

  create(dto: CreateProductDto): Product {
    const skuConflict = [...this.store.values()].find((p) => p.sku === dto.sku);
    if (skuConflict) {
      throw new ConflictException(`SKU '${dto.sku}' is already in use`);
    }

    const now = new Date();
    const product: Product = {
      id: randomUUID(),
      name: dto.name,
      sku: dto.sku,
      price: dto.price,
      description: dto.description,
      status: dto.status ?? 'draft',
      createdAt: now,
      updatedAt: now,
    };

    this.store.set(product.id, product);
    return product;
  }

  findAll(): Product[] {
    return [...this.store.values()];
  }

  findOne(id: string): Product {
    const product = this.store.get(id);
    if (!product) {
      throw new NotFoundException(`Product with id '${id}' not found`);
    }
    return product;
  }

  update(id: string, dto: UpdateProductDto): Product {
    const product = this.findOne(id);

    if (dto.sku !== undefined && dto.sku !== product.sku) {
      const skuConflict = [...this.store.values()].find(
        (p) => p.sku === dto.sku && p.id !== id,
      );
      if (skuConflict) {
        throw new ConflictException(`SKU '${dto.sku}' is already in use`);
      }
    }

    const updated: Product = {
      ...product,
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.sku !== undefined && { sku: dto.sku }),
      ...(dto.price !== undefined && { price: dto.price }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.status !== undefined && { status: dto.status }),
      updatedAt: new Date(),
    };

    this.store.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id); // throws NotFoundException if missing
    this.store.delete(id);
  }
}
