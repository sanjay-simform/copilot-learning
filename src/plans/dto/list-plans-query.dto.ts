import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Max,
  IsNumber,
  Min,
} from 'class-validator';
import type { PlanStatus } from '../entities/plan.entity';

export class ListPlansQueryDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsString()
  @IsOptional()
  q?: string;

  @IsEnum(['pending', 'active', 'done'] as const)
  @IsOptional()
  status?: PlanStatus;

  @IsEnum(['createdAt', 'updatedAt', 'title'] as const)
  @IsOptional()
  sortBy?: 'createdAt' | 'updatedAt' | 'title' = 'createdAt';

  @IsEnum(['asc', 'desc'] as const)
  @IsOptional()
  order?: 'asc' | 'desc' = 'desc';
}
