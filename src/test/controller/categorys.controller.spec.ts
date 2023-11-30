import { Test, TestingModule } from '@nestjs/testing';
import { CategorysController } from '../../modules/categorys/categorys.controller';
import { CategorysService } from '../../modules/categorys/categorys.service';
import { CategorysRepository } from '../../modules/categorys/categorys.repository';

describe('CategorysController', () => {
  const mockService = {};
  const mockRepository = {};
  let controller: CategorysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategorysController],
      providers: [
        { provide: CategorysService, useValue: mockService },
        { provide: CategorysRepository, useValue: mockRepository },
      ],
    }).compile();

    controller = module.get<CategorysController>(CategorysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
