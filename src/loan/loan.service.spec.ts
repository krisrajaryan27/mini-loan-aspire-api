import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { Loan } from './loan.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

class LoanRepositoryMock {
  // Mock repository methods as needed
}

describe('LoanService', () => {
  let service: LoanService;
  let repository: Repository<Loan>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(Loan), // Replace with your actual entity class
          useClass: LoanRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
    repository = module.get<Repository<Loan>>(getRepositoryToken(Loan));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
