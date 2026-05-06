import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlansService } from '../plans.service';
import { PlanEntity } from '../entities/plan.entity';

describe('PlansService', () => {
  let service: PlansService;
  let repository: Repository<PlanEntity>;

  const mockPlan: PlanEntity = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Plan',
    description: 'Test Description',
    status: 'pending',
    createdAt: new Date('2026-05-01'),
    updatedAt: new Date('2026-05-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlansService,
        {
          provide: getRepositoryToken(PlanEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlansService>(PlansService);
    repository = module.get<Repository<PlanEntity>>(
      getRepositoryToken(PlanEntity),
    );
  });

  describe('create', () => {
    it('should create a new plan', async () => {
      const createPlanDto = {
        title: 'Test Plan',
        description: 'Test Description',
      };

      (repository.create as jest.Mock).mockReturnValue(mockPlan);
      (repository.save as jest.Mock).mockResolvedValue(mockPlan);

      const result = await service.create(createPlanDto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Plan',
          description: 'Test Description',
          status: 'pending',
        }),
      );
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockPlan);
    });
  });

  describe('findOne', () => {
    it('should return a plan by id', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockPlan);

      const result = await service.findOne(mockPlan.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockPlan.id },
      });
      expect(result).toEqual(mockPlan);
    });

    it('should throw NotFoundException when plan not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a plan', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockPlan);
      (repository.remove as jest.Mock).mockResolvedValue(mockPlan);

      await service.remove(mockPlan.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockPlan.id },
      });
      expect(repository.remove).toHaveBeenCalledWith(mockPlan);
    });

    it('should throw NotFoundException when plan not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
