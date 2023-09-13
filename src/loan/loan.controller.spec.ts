import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { Loan } from './loan.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LoanController', () => {
  let loanController: LoanController;
  let loanService: LoanService;

  const mockLoanRepository = {
    findOne: jest.fn(),
    // ... other methods you may need to mock
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(Loan),
          useValue: mockLoanRepository,
        },
      ],
    }).compile();

    loanController = module.get<LoanController>(LoanController);
    loanService = module.get<LoanService>(LoanService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls between test cases
  });

  describe('createLoan', () => {
    it('should create a new loan', async () => {
      const loanDto = {
        amount: 100,
        term: 3,
      };

      const createdLoan: Loan = {
        id: '1',
        amount: 100,
        owner: 'user1',
        term: 3,
        status: 'PENDING',
        scheduledRepayments: [], // Simulate empty repayments
      };

      jest.spyOn(loanService, 'createLoan').mockResolvedValue(createdLoan);

      const result = await loanController.createLoan(loanDto);

      expect(result).toEqual(createdLoan);
    });

    it('should throw BadRequestException if loan data is missing', async () => {
      const loanDto = null;

      await expect(loanController.createLoan(loanDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('approveLoan', () => {
    it('should approve an existing loan', async () => {
      const loanId = '1';
      const approvedLoan: Loan = {
        id: loanId,
        status: 'APPROVED',
        amount: 100,
        term: 3,
        owner: 'user1',
        scheduledRepayments: [], // Simulate empty repayments
      };

      jest.spyOn(loanService, 'approveLoan').mockResolvedValue(approvedLoan);

      const result = await loanController.approveLoan(loanId);

      expect(result).toEqual(approvedLoan);
    });

    it('should throw NotFoundException if loan is not found', async () => {
      const loanId = '1';

      jest
        .spyOn(loanService, 'approveLoan')
        .mockRejectedValue(new NotFoundException());

      expect(loanController.approveLoan(loanId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('addRepayment', () => {
    it('should add a repayment to an existing loan', async () => {
      const loanId = '1';
      const repaymentDto = {
        amount: 50,
      };

      const updatedLoan: Loan = {
        id: loanId,
        status: 'PENDING',
        amount: 100,
        term: 3,
        owner: 'user1',
        scheduledRepayments: [
          { amount: 50, status: 'PENDING' },
          { amount: 50, status: 'PENDING' },
          { amount: 50, status: 'PENDING' },
        ],
      };

      jest.spyOn(loanService, 'addRepayment').mockResolvedValue(updatedLoan);

      const result = await loanController.addRepayment(loanId, repaymentDto);

      expect(result).toEqual(updatedLoan);
    });

    it('should throw NotFoundException if loan not found when adding repayment', async () => {
      // Mock the findOne method to return null, simulating a missing loan
      mockLoanRepository.findOne.mockResolvedValue(null);

      // Your test logic here
      await expect(
        loanController.addRepayment('invalid_loan_id', { amount: 100 }),
      ).rejects.toThrowError(NotFoundException);

      // Verify that findOne was called with the correct arguments
      expect(mockLoanRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'invalid_loan_id' },
      });
    });

    it('should throw BadRequestException if repayment amount is invalid', async () => {
      const loanId = '1';
      const repaymentDto = {
        amount: -50, // Negative amount
      };

      expect(
        loanController.addRepayment(loanId, repaymentDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
