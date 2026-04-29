import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './interfaces/product.interface';

@Injectable()
export class ProductsService {
  private readonly products: Map<string, Product> = new Map();

  findAll(): Product[] {
    return Array.from(this.products.values());
  }

  findOne(id: string): Product {
    const product = this.products.get(id);
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return product;
  }

  create(createProductDto: CreateProductDto): Product {
    const product: Product = {
      id: randomUUID(),
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(product.id, product);
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto): Product {
    const existing = this.findOne(id);
    const updated: Product = {
      ...existing,
      ...updateProductDto,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    this.findOne(id);
    this.products.delete(id);
  }
}
