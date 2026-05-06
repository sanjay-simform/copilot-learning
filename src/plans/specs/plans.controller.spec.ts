import { Test, TestingModule } from '@nestjs/testing';
import { PlansController } from '../plans.controller';
import { PlansService } from '../plans.service';

describe('PlansController', () => {
  let controller: PlansController;
  let service: PlansService;

  const mockPlanDto = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Plan',
    description: 'Test Description',
    status: 'pending',
    createdAt: new Date('2026-05-01'),
    updatedAt: new Date('2026-05-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlansController],
      providers: [
        {
          provide: PlansService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockPlanDto),
            findAll: jest.fn().mockResolvedValue({
              items: [mockPlanDto],
              meta: { total: 1, page: 1, limit: 10 },
            }),
            findOne: jest.fn().mockResolvedValue(mockPlanDto),
            update: jest.fn().mockResolvedValue(mockPlanDto),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<PlansController>(PlansController);
    service = module.get<PlansService>(PlansService);
  });

  describe('create', () => {
    it('should create a plan', async () => {
      const createPlanDto = {
        title: 'Test Plan',
        description: 'Test Description',
      };

      const result = await controller.create(createPlanDto);

      expect(service.create).toHaveBeenCalledWith(createPlanDto);
      expect(result).toEqual(mockPlanDto);
    });
  });

  describe('findAll', () => {
    it('should return a list of plans', async () => {
      const query = { page: 1, limit: 10 };

      const result = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).toEqual(
        expect.objectContaining({
          items: expect.any(Array),
          meta: expect.any(Object),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a plan by id', async () => {
      const id = mockPlanDto.id;

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockPlanDto);
    });
  });

  describe('update', () => {
    it('should update a plan', async () => {
      const id = mockPlanDto.id;
      const updatePlanDto = { title: 'Updated Plan' };

      const result = await controller.update(id, updatePlanDto);

      expect(service.update).toHaveBeenCalledWith(id, updatePlanDto);
      expect(result).toEqual(mockPlanDto);
    });
  });

  describe('remove', () => {
    it('should remove a plan', async () => {
      const id = mockPlanDto.id;

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
