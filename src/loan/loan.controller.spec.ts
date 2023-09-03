import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { Loan } from './loan.entity';
import { AddRepaymentDto } from './dto/add-repayment.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateLoanDto } from './dto/create-loan.dto';

// Mocking the LoanService and Repository
class LoanServiceMock {
  createLoan(_loanDto: CreateLoanDto): Promise<Loan> {
    return Promise.resolve({} as Loan);
  }

  approveLoan(_loanId: string): Promise<Loan> {
    return Promise.resolve({} as Loan);
  }

  viewLoans(_userId: string): Promise<Loan[]> {
    return Promise.resolve([] as Loan[]);
  }

  addRepayment(_loanId: string, _repaymentDto: AddRepaymentDto): Promise<Loan> {
    return Promise.resolve({} as Loan);
  }
}

class LoanRepositoryMock {
  // Mock repository methods as needed
}

describe('LoanController', () => {
  let controller: LoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        {
          provide: LoanService,
          useClass: LoanServiceMock,
        },
        {
          provide: getRepositoryToken(Loan), // Replace with your actual entity class
          useClass: LoanRepositoryMock,
        },
      ],
    }).compile();

    controller = module.get<LoanController>(LoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a loan', async () => {
    const loanDto: CreateLoanDto = {
      amount: 100,
      term: 3,
    };

    const result = await controller.createLoan(loanDto);
    expect(result).toBeDefined();
  });

  it('should approve a loan', async () => {
    const loanId = 'loan123';
    const result = await controller.approveLoan(loanId);
    expect(result).toBeDefined();
  });

  it('should view loans for a user', async () => {
    const userId = 'user123';
    const result = await controller.viewLoans(userId);
    expect(result).toBeDefined();
  });

  it('should add a repayment', async () => {
    const loanId = 'loan123';
    const repaymentDto: AddRepaymentDto = {
      amount: 50,
    };

    const result = await controller.addRepayment(loanId, repaymentDto);
    expect(result).toBeDefined();
  });
});
