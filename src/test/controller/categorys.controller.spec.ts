import { Test, TestingModule } from '@nestjs/testing';
import { CategorysController } from '../../categorys/categorys.controller';
import { CategorysService } from '../../categorys/categorys.service';
import { CategorysRepository } from '../../categorys/categorys.repository';

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
