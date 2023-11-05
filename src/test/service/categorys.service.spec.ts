import { Test, TestingModule } from '@nestjs/testing';
import { CategorysService } from '../../categorys/categorys.service';
import { CategorysRepository } from '../../categorys/categorys.repository';

describe('CategorysService', () => {
  const mockRepsitory = {};
  let service: CategorysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategorysService,
        { provide: CategorysRepository, useValue: mockRepsitory },
      ],
    }).compile();

    service = module.get<CategorysService>(CategorysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
