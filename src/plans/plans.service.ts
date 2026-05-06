import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { ListPlansQueryDto } from './dto/list-plans-query.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanEntity } from './entities/plan.entity';
import type { ListPlansResponse, PlanDto } from './types/plan.types';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) {}

  async create(dto: CreatePlanDto): Promise<PlanDto> {
    const plan = this.planRepository.create({
      title: dto.title,
      description: dto.description,
      status: dto.status ?? 'pending',
    });

    const savedPlan = await this.planRepository.save(plan);
    return this.toPlanDto(savedPlan);
  }

  async findAll(query: ListPlansQueryDto): Promise<ListPlansResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'createdAt';
    const order = query.order ?? 'desc';

    let qb = this.planRepository.createQueryBuilder('p');

    if (query.q) {
      qb = qb.andWhere('(p.title LIKE :q OR p.description LIKE :q)', {
        q: `%${query.q}%`,
      });
    }

    if (query.status) {
      qb = qb.andWhere('p.status = :status', { status: query.status });
    }

    const orderBy = this.getOrderByField(sortBy);
    qb = qb.orderBy(`p.${orderBy}`, order === 'asc' ? 'ASC' : 'DESC');

    qb = qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items: items.map((item) => this.toPlanDto(item)),
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  async findOne(id: string): Promise<PlanDto> {
    const plan = await this.planRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Plan with id '${id}' not found`);
    }

    return this.toPlanDto(plan);
  }

  async update(id: string, dto: UpdatePlanDto): Promise<PlanDto> {
    const plan = await this.planRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Plan with id '${id}' not found`);
    }

    if (dto.title !== undefined) {
      plan.title = dto.title;
    }

    if (dto.description !== undefined) {
      plan.description = dto.description;
    }

    if (dto.status !== undefined) {
      plan.status = dto.status;
    }

    const updated = await this.planRepository.save(plan);
    return this.toPlanDto(updated);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.planRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Plan with id '${id}' not found`);
    }

    await this.planRepository.remove(plan);
  }

  private toPlanDto(entity: PlanEntity): PlanDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  private getOrderByField(sortBy: string): string {
    const fieldMap: Record<string, string> = {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      title: 'title',
    };
    return fieldMap[sortBy] || 'createdAt';
  }
}
