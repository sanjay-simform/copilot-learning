import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { OrderStatus } from '../types/order.types';

class UpdateOrderItemDto {
  @IsUUID()
  productId!: string;

  @IsNumber()
  @IsPositive()
  quantity!: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  unitPrice!: number;
}

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  customerName?: string;

  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items?: UpdateOrderItemDto[];

  @IsEnum([
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ] as const)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  notes?: string;
}
