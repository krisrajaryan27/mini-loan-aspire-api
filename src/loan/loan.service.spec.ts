import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LoanService } from './loan.service';
import { Loan } from './loan.entity';
import { Repository } from 'typeorm';
import { CreateLoanDto } from './dto/create-loan.dto';
import { AddRepaymentDto } from './dto/add-repayment.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('LoanService', () => {
  let loanService: LoanService;
  let loanRepository: Repository<Loan>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(Loan),
          useClass: Repository,
        },
      ],
    }).compile();

    loanService = module.get<LoanService>(LoanService);
    loanRepository = module.get<Repository<Loan>>(getRepositoryToken(Loan));
  });

  it('should be defined', () => {
    expect(loanService).toBeDefined();
  });

  describe('createLoan', () => {
    it('should create a loan', async () => {
      const createLoanDto: CreateLoanDto = {
        amount: 1000,
        term: 12,
      };

      const savedLoan = new Loan();
      savedLoan.id = '1';
      savedLoan.owner = 'user1';
      savedLoan.amount = createLoanDto.amount;
      savedLoan.term = createLoanDto.term;
      savedLoan.status = 'PENDING';

      jest.spyOn(loanRepository, 'save').mockResolvedValue(savedLoan);

      const result = await loanService.createLoan(createLoanDto);

      expect(result).toEqual(savedLoan);
    });

    it('should throw BadRequestException if loanDto is missing', async () => {
      const createLoanDto: CreateLoanDto = null;

      await expect(loanService.createLoan(createLoanDto)).rejects.toThrowError(
        BadRequestException,
      );
    });

    // Add more tests for input validation and edge cases
  });

  describe('approveLoan', () => {
    it('should approve a loan', async () => {
      const loanId = '1';

      const existingLoan = new Loan();
      existingLoan.id = loanId;
      existingLoan.status = 'PENDING';

      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(existingLoan);
      jest.spyOn(loanRepository, 'save').mockResolvedValue(existingLoan);

      const result = await loanService.approveLoan(loanId);

      expect(result.status).toEqual('APPROVED');
    });

    it('should return the loan if it is already approved', async () => {
      const loanId = '1';

      const existingLoan = new Loan();
      existingLoan.id = loanId;
      existingLoan.status = 'APPROVED';

      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(existingLoan);

      const result = await loanService.approveLoan(loanId);

      expect(result.status).toEqual('APPROVED');
    });

    it('should throw NotFoundException if loan does not exist', async () => {
      const loanId = '1';

      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(null);

      await expect(loanService.approveLoan(loanId)).rejects.toThrowError(
        NotFoundException,
      );
    });

    // Add more tests for edge cases
  });

  // Similar test suites for viewLoans and addRepayment methods

  describe('addRepayment', () => {
    it('should add a repayment', async () => {
      const loanId = '1';
      const repaymentDto: AddRepaymentDto = {
        amount: 100,
      };

      const existingLoan = new Loan();
      existingLoan.id = loanId;
      existingLoan.status = 'PENDING';
      existingLoan.scheduledRepayments = [
        {
          amount: 100,
          dueDate: new Date(),
          status: 'PENDING',
        },
      ];

      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(existingLoan);
      jest.spyOn(loanRepository, 'save').mockResolvedValue(existingLoan);

      const result = await loanService.addRepayment(loanId, repaymentDto);

      // Assert that the repayment status is updated to 'PAID'
      expect(result.scheduledRepayments[0].status).toEqual('PAID');
    });

    it('should update the loan status to PAID if all repayments are PAID', async () => {
      const loanId = '1';
      const repaymentDto: AddRepaymentDto = {
        amount: 100,
      };

      const existingLoan = new Loan();
      existingLoan.id = loanId;
      existingLoan.status = 'PENDING';
      existingLoan.scheduledRepayments = [
        {
          amount: 100,
          dueDate: new Date(),
          status: 'PENDING',
        },
      ];

      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(existingLoan);
      jest.spyOn(loanRepository, 'save').mockResolvedValue(existingLoan);

      const result = await loanService.addRepayment(loanId, repaymentDto);

      // Assert that the loan status is updated to 'PAID'
      expect(result.status).toEqual('PAID');
    });

    it('should throw NotFoundException if loan does not exist', async () => {
      const loanId = '1';
      const repaymentDto: AddRepaymentDto = {
        amount: 100,
      };

      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(null);

      await expect(
        loanService.addRepayment(loanId, repaymentDto),
      ).rejects.toThrowError(NotFoundException);
    });

    // Add more tests for input validation and edge cases
  });
});
