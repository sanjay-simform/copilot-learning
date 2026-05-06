import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import type { PlanStatus } from '../entities/plan.entity';

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @IsEnum(['pending', 'active', 'done'] as const)
  @IsOptional()
  status?: PlanStatus;
}
