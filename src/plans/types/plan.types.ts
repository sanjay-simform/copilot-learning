import type { PlanStatus } from '../entities/plan.entity';

export interface PlanDto {
  id: string;
  title: string;
  description?: string;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListPlansResponse {
  items: PlanDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
